from flask import Blueprint, request, jsonify
from middleware.auth import token_required, roles_allowed
from bson import ObjectId
import datetime

donor_bp = Blueprint('donor', __name__)

def get_db():
    from app import mongo
    return mongo.db

@donor_bp.route('/donate', methods=['POST'])
@token_required
@roles_allowed('donor')
def donate_blood(current_user, role):
    db = get_db()
    data = request.json
    
    user = db.users.find_one({"_id": ObjectId(current_user)})
    
    donation = {
        "donor_id": current_user,
        "donor_name": user['name'],
        "blood_group": user['blood_group'],
        "units": int(data['units']),
        "date": datetime.datetime.utcnow(),
        "status": "completed"
    }
    
    db.donations.insert_one(donation)
    
    # Update Stock
    db.blood_stock.update_one(
        {"blood_group": user['blood_group']},
        {"$inc": {"units": int(data['units'])}},
        upsert=True
    )
    
    return jsonify({"message": "Donation recorded successfully"})

@donor_bp.route('/history', methods=['GET'])
@token_required
@roles_allowed('donor')
def donation_history(current_user, role):
    db = get_db()
    history = list(db.donations.find({"donor_id": current_user}).sort("date", -1))
    for h in history:
        h['_id'] = str(h['_id'])
    return jsonify(history)
