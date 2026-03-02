import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/bloodbank")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret-key-123")
    PORT = int(os.getenv("PORT", 5000))
    DEBUG = os.getenv("FLASK_ENV") == "development"
