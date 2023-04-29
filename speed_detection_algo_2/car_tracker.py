import time
import cv2
import time
from csv import writer
import math
import dlib

# creating a dataset by using the haar cascade classifier
# the xml files can be created using the positive and negative images of the object to be detected.
dataset_1 = cv2.CascadeClassifier(r'dataset\cars.xml')
dataset_2 = cv2.CascadeClassifier(r'dataset\myhaar.xml')

# video
video_c = cv2.VideoCapture(r'videos\cars.mp4') 


# --------- SPEED CALCULATION --------------- (FR)
def vehicle_speed(side1, side2):
    # calculating distance moved by the object from the difference 
    # between the object pixels between 2 frames 
    pixels = math.sqrt(
        math.pow(side2[0] - side1[0], 2) + math.pow(side2[1] - side1[1], 2)
    )

    ppm = 16.8      # pixels per minute
    meters = pixels / ppm
    fps = 18
    speed = meters * fps * 3.6
    return speed


# multiple car tracker fullfilling the Multi-detection Functional requirement
# -------- MULTI DETECTION ----------- (FR)
def multiple_car_tracker():
    frame_counter = 0
    current_car = 1     # car count starts from 1
    car_tracker = {}   

    car_side1 = {}
    car_side2 = {} 
    speed = [None] * 1000
    fps = 0

    height = 1280
    width = 720

    while True:
        start_time = time.time()

        # .read() returns a tuple, of which video stores the frame of the video
        rc, video = video_c.read()

        if type(video) == type(None):
            break

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

        for car_track in delete_car:
            print(f'Removed Car ID {car_track} from List trackers')
            car_tracker.pop(car_track, None)
            car_side1.pop(car_track, None)
            car_side2.pop(car_track, None)

        # --------- OBJECT TRACKING ---------- 
        for car_track in car_tracker.keys():
            tracked_position = car_tracker[car_track].get_position()

            # this is not to get the fixed size of rectangle for each object, instead it adapts according to the size of each object
            t_x = int(tracked_position.left())
            t_y = int(tracked_position.top())
            t_w = int(tracked_position.width())
            t_h = int(tracked_position.height())


            # spots the vehicle and the color assigned is green
            cv2.rectangle(
                video_final,
                (t_x, t_y), (t_x + t_w, t_y + t_h),
                color=(0, 255, 0), thickness=4
            ) 

            # tracking the position of the object for the  current frame 
            car_side2[car_track] = [t_x, t_y, t_w, t_h]
        


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
                minNeighbors=4,
                minSize=(30, 30),
                flags=cv2.CASCADE_SCALE_IMAGE
            )


            # -------------- ACCURATE DETECTION ------------- (NFR)
            with open(
                r'V-core\vehicle.csv' and r'V-core\cars-2.csv', 'a', newline=''
            ) as f_object:    # 2nd dataset is used on top of the detected objects 
                              # to increase detection accuracy

                for (x, y, w, h) in cars:
                    cv2.rectangle(video, (x, y), (x+w, y+h),
                                  color=(255, 0, 0), thickness=2)
                    roi_gray = gray_scale[y:y+h, x:x+w]
                    roi_color = video[y:y+h, x:x+w]
                    cars2 = dataset_2.detectMultiScale(roi_gray)

                    for (ex, ey, ew, eh) in cars2:
                        cv2.rectangle(roi_color, (ex, ey),
                                      (ex+ew, ey+eh), (0, 255, 0), 2)

                        data = str(w)+','+str(h)+','+str(ew)+','+str(eh)

                        writer_object = writer(f_object)
                        # The writerow method writes a row of data into the specified file.
                        writer_object.writerow([data])

                for (_x, _y, _w, _h) in cars:
                    x = int(_x)
                    y = int(_y)
                    w = int(_w)
                    h = int(_h)

                    x_bar = x + 0.5 * w
                    y_bar = y + 0.5 * h

                    match_car = None

                    for car_track in car_tracker.keys():
                        tracked_position = car_tracker[car_track].get_position()
                        
                        t_x = int(tracked_position.left())
                        t_y = int(tracked_position.top())
                        t_w = int(tracked_position.width())
                        t_h = int(tracked_position.height())

                        # to calculate center of the tracked car
                        t_x_bar = t_x + 0.5 * t_w
                        t_y_bar = t_y + 0.5 * t_h
                        

                        # checking if the center and position of the detected car matches the tracked car
                        if (
                            (t_x <= x_bar <= (t_x + t_w)) and (t_y <= y_bar <= (t_y + t_h)
                                                               ) and (x <= t_x_bar <= (x + w)) and (y <= t_y_bar <= (y + h))
                        ):
                            match_car = car_track
                    

                    # if match is not found, create a new tracker
                    # Therefore, through here we make the list of tracker cars car_tracker
                    if match_car is None:
                        print(f'Creating new tracker {str(current_car)}')

                        tracker = dlib.correlation_tracker()
                        tracker.start_track(
                            video, dlib.rectangle(x, y, x + w, y + h)
                        )

                        car_tracker[current_car] = tracker
                        
                        # storing the position of the object for the starting frame(frame from which the object is detected)
                        car_side1[current_car] = [x, y, w, h]
                        current_car += 1


        # Calculating speed of the object from the set of object positions over different frames
        # --------- SPEED CALCULATION --------------- (FR)
        for i in car_side2.keys():
            if frame_counter % 1 == 0:  # remainder of the frame counter
                [x1, y1, w1, h1] = car_side1[i]
                [x2, y2, w2, h2] = car_side2[i]

                car_side1[i] = [x2, y2, w2, h2]

                if [x1, y1, w1, h1] != [x2, y2, w2, h2]:
                    if (
                        speed[i] == None
                    ) and y1 >= 275 and y1 <= 285:
                        speed[i] = vehicle_speed(
                            [x1, y1, w1, h1], [x2, y2, w2, h2]
                        )

                    if speed[i] != None and y1 >= 180:
                        cv2.putText(    # speed of the vehicle part
                            video_final,
                            str(int(speed[i])) + " km/hr",
                            (int(x1 + w1/2), int(y1-20)),    # position of the text
                            cv2.FONT_HERSHEY_SIMPLEX, fontScale=0.75,
                            color=(255, 255, 255), thickness=2
                        )

            end_time = time.time()
            if not (end_time == start_time):
                fps = 1.0 / (end_time - start_time)

        cv2.putText(
            video_final, 'FPS: ' + str(int(fps)),
            (900, 480), cv2.FONT_HERSHEY_DUPLEX,
            fontScale=0.75, color=(0, 0, 255),
            thickness=2
        )

        cv2.imshow('Car Speed Detector', video_final)

        if cv2.waitKey(33) == ord('q'):
            break   # loop break

    cv2.destroyAllWindows()


if __name__ == '__main__':
    multiple_car_tracker()


