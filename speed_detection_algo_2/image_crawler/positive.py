from icrawler.builtin import BingImageCrawler, GoogleImageCrawler
import os
import shutil

def positive_image_generator(object,num):
    path = "C:/Users/kanda/Desktop/SE_dataset/new-dataset"
    if not os.path.exists(path):
        os.mkdir(path)
    
    new_path = os.path.join(path, "p")

    if not os.path.exists(new_path):
        os.mkdir(new_path)
    else:
        shutil.rmtree(new_path)
        os.mkdir(new_path)

    classes=object.split(',')
    number=num
    for c in classes:
        bing_crawler=BingImageCrawler(parser_threads=7, downloader_threads=14,storage={'root_dir': fr'C:\Users\kanda\Desktop\SE_dataset\new-dataset\p'})
        bing_crawler.crawl(keyword=c,filters=None,max_num=number,offset=0)
