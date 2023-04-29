import os
import time
import shutil

def generate_xml(file_name):
    # os.system('cmd /c ""C:\Program Files\Cascade Trainer GUI\Cascade-Trainer-GUI.exe" -f ".\cascade_trainer_settings.ini""')
    os.system('cmd /c ""C:\Program Files\Cascade Trainer GUI\Cascade-Trainer-GUI.exe""')


    src_path = r'C:\Users\kanda\Desktop\SE_dataset\new-dataset\classifier\cascade.xml'
    dst_path = fr'xml-dataset\{file_name}.xml'

    rm_dir = r'C:\Users\kanda\Desktop\SE_dataset\new-dataset'

    time_to_wait = 10
    time_counter = 0
    while not os.path.exists(src_path):
        time.sleep(1)
        time_counter += 1
        if time_counter > time_to_wait:break
    
    if os.path.isfile(src_path):
        os.rename(src_path, dst_path)
        shutil.rmtree(rm_dir, ignore_errors=False, onerror=None)
    else:
        raise ValueError("%s isn't a file!" % src_path)
