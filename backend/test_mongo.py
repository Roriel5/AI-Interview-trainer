import os
from dotenv import load_dotenv
from pymongo import MongoClient
import certifi

load_dotenv()

uri = os.getenv("MONGODB_URI")
print(f"Connecting to: {uri}")

try:
    client = MongoClient(uri, tlsCAFile=certifi.where(), serverSelectionTimeoutMS=5000)
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(f"Connection failed: {e}")
