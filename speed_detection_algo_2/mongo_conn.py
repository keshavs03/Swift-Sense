from pymongo import MongoClient
from dotenv import load_dotenv
import os

def configure():
    load_dotenv()

def mongo_conn():
    configure()
    try:
        conn = MongoClient(host=os.getenv('MONGO_URI'), port=int(os.getenv('MONGO_PORT')))
        print('MongoDB connected', conn)
        return conn
    except Exception as e:
        print('Error in mongo connection:', e)
