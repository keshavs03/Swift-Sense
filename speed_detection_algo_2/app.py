from flask import Flask, render_template, request, Response, redirect, flash, session, url_for,jsonify
from werkzeug.utils import secure_filename
import os
import time
import cv2
import time
from csv import writer
import math
from graph import *
from image_crawler.negative import *
from image_crawler.positive import *
from xml_generator import *
import _dlib_pybind11
from multiprocessing import Process
from dotenv import load_dotenv
from flask_cors import CORS
from werkzeug.exceptions import HTTPException
import logging
import traceback

app = Flask(__name__) 
logger = logging.getLogger('werkzeug')

@app.errorhandler(HTTPException)
def handle_http_exception(error):
    error_dict = {
        'code': error.code,
        'description': error.description,
        'stack_trace': traceback.format_exc() 
    }
    log_msg = f"HTTPException {error_dict.code}, Description: {error_dict.description}, Stack trace: {error_dict.stack_trace}"
    logger.log(msg=log_msg)
    response = jsonify(error_dict)
    response.status_code = error.code
    return response

CORS(app)
email_id = ""

app.secret_key = "secret key"
UPLOAD_FOLDER = r"static\upload"

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1000 * 1000

input = ""
ALLOWED_VIDEO_EXTENSIONS = {"mkv", "mp4", "avi"}

def file_allowed(filename):
    return (
        '.' in filename and filename.rsplit(
            '.', 1)[1].lower() in ALLOWED_VIDEO_EXTENSIONS
    )


@app.route("/")
def home():
    print("home")
    return render_template("video_upload_new.html")

@app.route("/user_email", methods=["POST"])
def user_details():
    data = request.get_json()
    email_id = data['user_email']
    os.environ["USER_EMAIL"] = email_id
    return jsonify({'result':'Success'})


@app.route("/upload", methods=['GET', 'POST'])
def upload_file():
    print("upload")
    if request.method == "POST":
        # check if the post request has the file part
        if "file" not in request.files:
            flash("No file part")
            return redirect(request.url)

        file = request.files["file"]

        if file.filename == "":
            flash("No file selected for uploading")
            return redirect(request.url)

        if file and file_allowed(file.filename):
            filename = secure_filename(file.filename)

            global input
            input = filename
            file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))

            global xml_file, positive_prompt, negative_prompt
            xml_file, positive_prompt, negative_prompt = request.form['detect_object'], request.form['positive_image'], request.form['negative_image']

            flash("File successfully uploaded")
            return render_template("upload.html", fname=filename)
        else:
            flash("Allowed image types are -> mkv, mp4, avi")
            return redirect(request.url)
        


# --------- SPEED CALCULATION --------------- (FR)
def vehicle_speed(side1, side2):
    # calculating distance moved by the object from the difference 
    # between the object pixels between 2 frames 
    pixels = math.sqrt(
        math.pow(side2[0] - side1[0], 2) + math.pow(side2[1] - side1[1], 2)
    )
    ppm = 16.8       # pixels per minute
    meters = pixels / ppm
    fps = 18
    speed = meters * fps * 3.6
    return speed

# multiple car tracker fullfilling the Multi-detection Functional requirement
# -------- MULTI DETECTION ----------- (FR)

def if_xml_not_found():
    xml_exists = os.path.isfile(fr"xml-dataset\{xml_file}.xml")
    if xml_exists == False:
        # parallel processing to generate positive and negative images
        p1 = Process(target=positive_image_generator, args=(positive_prompt,100))
        p2 = Process(target=negative_image_generator, args=(negative_prompt,100))
        p1.start()
        p2.start()
        p1.join()
        p2.join()
        generate_xml(xml_file)


def gen():
    # creating a dataset by using the haar cascade classifier
    # the xml files can be created using the positive and negative images of the object to be detected.

    dataset_1 = cv2.CascadeClassifier(fr"xml-dataset\{xml_file}.xml")
    dataset_2 = cv2.CascadeClassifier(fr"xml-dataset\{xml_file}.xml")

    global input
    inp = os.path.join(app.config["UPLOAD_FOLDER"], input)

    video_c = cv2.VideoCapture(inp)
    video_c.set(cv2.CAP_PROP_BUFFERSIZE, 2)

    frame_counter = 0
    current_car = 1  # car count starts from 1
    car_tracker = {}

    car_side1 = {}
    car_side2 = {}
    speed = [None] * 1000
    fps = 0

    height = 1280
    width = 720

    if os.path.exists(r"csv-dataset\output.csv"):
        os.remove(r"csv-dataset\output.csv")
    with open(r"csv-dataset\output.csv", "a", newline="") as f_object:
        writer_object = writer(f_object)
        writer_object.writerow(['object_track_no' , 'frame_no' , 'speed'])
        
        while True:
            start_time = time.time()

            # .read() returns a tuple, of which video stores the frame of the video
            ret, video = video_c.read()
            if ret == True:

                # adds the video to the screen and adjusts the size
                video = cv2.resize(video, (height, width))
                video_final = video.copy()

                # incrementing frames repeatedly
                frame_counter += 1

                delete_car = []

                # ---------- QUALITY DETECTION ------------- 
                for car_track in car_tracker.keys():
                    quality_tracker = car_tracker[car_track].update(video)

                    # if the quality of tracker(ie accuracy and reliability of the correlation tracker in detection) is less than 7
                    #, then the tracker is removed from the car_tracker list 
                    # This prevents false positives and false negatives.
                    # -------------- ACCURATE DETECTION ------------- (NFR)
                    if quality_tracker < 7:
                        delete_car.append(car_track)

                rectangle_color = (0, 255, 0)

                # --------- OBJECT TRACKING ---------- 
                for car_track in car_tracker.keys():
                    tracked_position = car_tracker[car_track].get_position()

                    # this is not to get the default size of rectangle for each vehicle. instead it adapts according to the moment and size of the vehicle.
                    t_x = int(tracked_position.left())
                    t_y = int(tracked_position.top())
                    t_w = int(tracked_position.width())
                    t_h = int(tracked_position.height())

                    # spots the vehicle and the color assigned is green
                    cv2.rectangle(
                        video_final,
                        (t_x, t_y), (t_x + t_w, t_y + t_h),
                        rectangle_color, 2
                    )  
                    # tracking the position of the object for the  current frame
                    car_side2[car_track] = [t_x, t_y, t_w, t_h]

                for car_track in delete_car:
                    print(f"Removed Car ID {car_track} from List trackers")
                    car_tracker.pop(car_track, None)
                    car_side1.pop(car_track, None)
                    car_side2.pop(car_track, None)


                # I am executing the detectMultiScale() function only ..  
                # every 10 frames because this function is computationally expensive
                # Also, in 10 frames, the object is unlikely to move significantly, .. 
                # so it is not necessary to execute it every frame
                # ---------- FAST PROCESSING ------------- (NFR)
                # ---------- OBJECT DETECTION -------------
                if not (frame_counter % 10):
                    gray_scale = cv2.cvtColor(video, cv2.COLOR_BGR2GRAY)
                    cars = dataset_1.detectMultiScale(
                        gray_scale,
                        scaleFactor=1.3, # for accurate detection keep this value low, but for fast detection keep it high
                        minNeighbors=4, # higher value leads to less detections but with higher quality 
                        minSize=(30, 30),
                        flags=cv2.CASCADE_SCALE_IMAGE,
                    )

                    # -------------- ACCURATE DETECTION ------------- (NFR)
                    # 2nd dataset is used on top of the detected objects 
                    # to increase detection accuracy
                    for (x, y, w, h) in cars:
                        cv2.rectangle(video,
                                        (x, y), (x + w, y + h),
                                        (255, 0, 0), 2
                                        )

                        roi_gray = gray_scale[y: y + h, x: x + w]
                        roi_color = video[y: y + h, x: x + w]
                        cars2 = dataset_2.detectMultiScale(roi_gray)

                        # overwrites the previous detection rectangle following the increase in accuracy behalf of the dataset implemented
                        for (ex, ey, ew, eh) in cars2:
                            cv2.rectangle(
                                roi_color, (ex, ey),
                                (ex + ew, ey + eh),
                                (0, 255, 0), 2
                            )

                    for (_x, _y, _w, _h) in cars:
                        x = int(_x)
                        y = int(_y)
                        w = int(_w)
                        h = int(_h)

                        x_bar = x + 0.5 * w
                        y_bar = y + 0.5 * h

                        match_car = None

                        for car_track in car_tracker.keys():
                            tracked_position = car_tracker[car_track].get_position(
                            )

                            t_x = int(tracked_position.left())
                            t_y = int(tracked_position.top())
                            t_w = int(tracked_position.width())
                            t_h = int(tracked_position.height())

                            # to calculate center of the tracked car
                            t_x_bar = t_x + 0.5 * t_w
                            t_y_bar = t_y + 0.5 * t_h

                            # checking if the center and position of the detected car matches the tracked car
                            if (
                                (t_x <= x_bar <= (t_x + t_w))
                                and (t_y <= y_bar <= (t_y + t_h))
                                and (x <= t_x_bar <= (x + w))
                                and (y <= t_y_bar <= (y + h))
                            ):
                                match_car = car_track


                        # if match is not found, create a new tracker
                        # Therefore, through here we make the list of tracker cars car_tracker
                        if match_car is None:
                            print(f"Creating new tracker {str(current_car)}")

                            # tracker = dlib.correlation_tracker()
                            # tracker.start_track(
                            #     video, dlib.rectangle(x, y, x + w, y + h))
                            
                            try:
                                tracker = _dlib_pybind11.correlation_tracker()
                                tracker.start_track(
                                    video, _dlib_pybind11.rectangle(x, y, x + w, y + h))
                            except Exception as excp:
                                print(excp + "\n" + "Error in dlib function")

                            car_tracker[current_car] = tracker
                            # storing the position of the object for the starting frame(frame from which the object is detected)
                            car_side1[current_car] = [x, y, w, h]
                            current_car += 1


                # Calculating speed of the object from the set of object positions over different frames
                # --------- SPEED CALCULATION --------------- (FR)
                for i in car_side2.keys():
                    if frame_counter % 1 == 0:
                        [x1, y1, w1, h1] = car_side1[i]
                        [x2, y2, w2, h2] = car_side2[i]

                        car_side1[i] = [x2, y2, w2, h2]

                        if [x1, y1, w1, h1] != [x2, y2, w2, h2]:
                            if (speed[i] == None or speed[i] == 0) and y1 >= 100 and y1 <= 300:
                                speed[i] = vehicle_speed(
                                    [x1, y1, w1, h1], [x2, y2, w2, h2])
                            if speed[i] != None and y1 >= 75:
                                data = [str(current_car) , str(frame_counter) , str(speed[i])]
                                # The writerow method writes a row of data into the specified file.
                                writer_object.writerow(data)
                                cv2.putText(                                    # speed of the vehicle part
                                    video_final, str(int(speed[i])) + " km/hr",
                                    (int(x1 + w1 / 2), int(y1 - 5)),            # position of the text
                                    cv2.FONT_HERSHEY_DUPLEX, fontScale=0.75,
                                    color=(0, 0, 255), thickness=2,
                                )

                    end_time = time.time()
                    if not (end_time == start_time):
                        fps = 1.0 / (end_time - start_time)

                cv2.putText(
                    video_final,
                    "FPS: " + str(int(fps)),
                    (900, 480),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    fontScale=0.75,
                    color=(0, 0, 255),
                    thickness=2,
                )

                try:
                    frame = cv2.imencode('.jpg', video_final)[1].tobytes()
                    yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
                    # time.sleep(0.1)     # video stream
                except Exception as excp:
                    print(excp + "\n" + "Error in video stream")

            else:
                print('Video Capture Failed')
                break
    print('\nClosing video')
    video_c.release()
    cv2.destroyAllWindows()
    plot_graph(xml_file)


@app.route('/video_feed')
def video_feed():
    if_xml_not_found()
    print('Starting video stream')
    return Response(gen(), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == "__main__":
    app.run(port=3606, debug=True)
