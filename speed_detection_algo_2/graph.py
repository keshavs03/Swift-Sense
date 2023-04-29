import matplotlib.pyplot as plt
import pandas as pd
from  mongo_conn import *
import glob
import os
import gridfs


def plot_graph(imagename):
    plt.style.use('bmh')
    df = pd.read_csv(r"csv-dataset\output.csv")

    tot_list = df['object_track_no'].tolist()
    n1 = tot_list[0]
    n2 = tot_list[-1]

    files = glob.glob('graphs/*')
    for f in files:
        os.remove(f)

    conn = mongo_conn()
    db = conn.SEproject

    for i in range(n1, n2+1):
        specified = df.loc[df['object_track_no'] == i]
        if(len(specified) == 0):
            continue
        x = specified['frame_no']
        y = specified['speed']
        fig = plt.figure()
        plt.xlabel('Frame No')
        plt.ylabel('Speed')
        plt.title('Object Track No: {}'.format(i))
        plt.plot(x, y)
        plt.savefig(r"graphs\{}.png".format(i))
        plt.close(fig)

        file_name = "{}.png".format(i)
        print(file_name)
        file_location = "graphs/" + file_name
        file_data = open(file_location, "rb")
        data = file_data.read()
        fs = gridfs.GridFS(db)
        image_name = imagename + "_" + file_name
        fs.put(data, filename = image_name, user_email = os.getenv('USER_EMAIL'))
        print("upload complete")

    files = glob.glob('graphs/*')
    for f in files:
        os.remove(f)
