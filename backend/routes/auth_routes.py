from flask import Blueprint, request, jsonify, current_app
from flask_bcrypt import Bcrypt
import jwt
import datetime
from bson import ObjectId

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()

def get_db():
    from app import mongo
    return mongo.db

@auth_bp.route('/register', methods=['POST'])
def register():
    db = get_db()
    data = request.json
    
    required_fields = ['name', 'email', 'password', 'role']
    if not all(k in data for k in required_fields):
        return jsonify({"message": "Missing required fields"}), 400

    if db.users.find_one({"email": data['email']}):
        return jsonify({"message": "Email already registered"}), 400
        
    hashed_pw = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    
    user = {
        "name": data['name'],
        "email": data['email'],
        "password": hashed_pw,
        "role": data['role'], # 'admin', 'donor', 'hospital'
        "status": "approved" if data['role'] == 'admin' else "pending",
        "blood_group": data.get('blood_group'),
        "created_at": datetime.datetime.utcnow()
    }
    
    db.users.insert_one(user)
    return jsonify({"message": "Registration successful. Please wait for admin approval."}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    db = get_db()
    data = request.json
    user = db.users.find_one({"email": data['email']})
    
    if user and bcrypt.check_password_hash(user['password'], data['password']):
        if user['status'] != "approved":
            return jsonify({"message": "Account pending approval by Admin"}), 403
            
        token = jwt.encode({
            'user_id': str(user['_id']),
            'role': user['role'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, current_app.config["JWT_SECRET_KEY"], algorithm="HS256")
        
        return jsonify({
            "token": token, 
            "role": user['role'], 
            "name": user['name'],
            "userId": str(user['_id'])
        })
    
    return jsonify({"message": "Invalid email or password"}), 401
