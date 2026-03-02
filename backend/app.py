from flask import Flask, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from config import Config
import os

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS
CORS(app)

# Initialize MongoDB
mongo = PyMongo(app)

# Import Blueprints
from routes.auth_routes import auth_bp
from routes.admin_routes import admin_bp
from routes.donor_routes import donor_bp
from routes.hospital_routes import hospital_bp

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(donor_bp, url_prefix='/api/donor')
app.register_blueprint(hospital_bp, url_prefix='/api/hospital')

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "blood-bank-api"})

# Initializing blood stock if empty
@app.before_request
def initialize_stock():
    # Only run this once on startup
    if mongo.db.blood_stock.count_documents({}) == 0:
        initial_stock = [
            {"blood_group": "A+", "units": 0},
            {"blood_group": "A-", "units": 0},
            {"blood_group": "B+", "units": 0},
            {"blood_group": "B-", "units": 0},
            {"blood_group": "AB+", "units": 0},
            {"blood_group": "AB-", "units": 0},
            {"blood_group": "O+", "units": 0},
            {"blood_group": "O-", "units": 0},
        ]
        mongo.db.blood_stock.insert_many(initial_stock)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=Config.PORT, debug=Config.DEBUG)
