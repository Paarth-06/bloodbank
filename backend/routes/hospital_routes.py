from flask import Blueprint, request, jsonify
from middleware.auth import token_required, roles_allowed
from bson import ObjectId
import datetime

hospital_bp = Blueprint('hospital', __name__)

def get_db():
    from app import mongo
    return mongo.db

@hospital_bp.route('/request', methods=['POST'])
@token_required
@roles_allowed('hospital')
def request_blood(current_user, role):
    db = get_db()
    data = request.json
    
    # Check current stock
    stock = db.blood_stock.find_one({"blood_group": data['blood_group']})
    if not stock or stock['units'] < int(data['units']):
        return jsonify({"message": "Insufficient blood units in stock"}), 400
        
    blood_request = {
        "hospital_id": current_user,
        "blood_group": data['blood_group'],
        "units": int(data['units']),
        "is_emergency": data.get('is_emergency', False),
        "status": "approved", # Auto-approving for simplicity in this version
        "date": datetime.datetime.utcnow()
    }
    
    # Deduct stock
    db.blood_stock.update_one(
        {"blood_group": data['blood_group']},
        {"$inc": {"units": -int(data['units'])}}
    )
    
    db.blood_requests.insert_one(blood_request)
    return jsonify({"message": "Blood request processed successfully"})

@hospital_bp.route('/history', methods=['GET'])
@token_required
@roles_allowed('hospital')
def request_history(current_user, role):
    db = get_db()
    history = list(db.blood_requests.find({"hospital_id": current_user}).sort("date", -1))
    for h in history:
        h['_id'] = str(h['_id'])
    return jsonify(history)
