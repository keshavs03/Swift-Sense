import unittest
from pymongo import MongoClient
from dotenv import load_dotenv
import os

class TestMongoConn(unittest.TestCase):

    def test_configure(self):
        # Ensure that the dotenv configuration is loaded successfully
        load_dotenv()
        self.assertIsNotNone(os.getenv('MONGO_URI'))
        self.assertIsNotNone(os.getenv('MONGO_PORT'))

    def test_mongo_conn(self):
        # Ensure that the MongoClient connects to MongoDB successfully
        conn = MongoClient(host=os.getenv('MONGO_URI'), port=int(os.getenv('MONGO_PORT')))
        self.assertIsNotNone(conn)
        self.assertTrue(conn.server_info())

        


if __name__ == '__main__':
    unittest.main()