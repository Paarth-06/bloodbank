from flask import Blueprint, request, jsonify
from middleware.auth import token_required, roles_allowed
from bson import ObjectId

admin_bp = Blueprint('admin', __name__)

def get_db():
    from app import mongo
    return mongo.db

@admin_bp.route('/stats', methods=['GET'])
@token_required
@roles_allowed('admin')
def get_stats(current_user, role):
    db = get_db()
    donors_count = db.users.count_documents({"role": "donor"})
    hospitals_count = db.users.count_documents({"role": "hospital"})
    pending_users = db.users.count_documents({"status": "pending"})
    
    stock = list(db.blood_stock.find({}, {"_id": 0}))
    
    return jsonify({
        "donors": donors_count,
        "hospitals": hospitals_count,
        "pending": pending_users,
        "stock": stock
    })

@admin_bp.route('/users/pending', methods=['GET'])
@token_required
@roles_allowed('admin')
def get_pending_users(current_user, role):
    db = get_db()
    users = list(db.users.find({"status": "pending"}))
    for u in users:
        u['_id'] = str(u['_id'])
        del u['password']
    return jsonify(users)

@admin_bp.route('/users/approve/<user_id>', methods=['POST'])
@token_required
@roles_allowed('admin')
def approve_user(current_user, role, user_id):
    db = get_db()
    db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"status": "approved"}})
    return jsonify({"message": "User approved successfully"})

@admin_bp.route('/requests', methods=['GET'])
@token_required
@roles_allowed('admin')
def get_all_requests(current_user, role):
    db = get_db()
    requests = list(db.blood_requests.find().sort("date", -1))
    for r in requests:
        r['_id'] = str(r['_id'])
        hospital = db.users.find_one({"_id": ObjectId(r['hospital_id'])})
        r['hospital_name'] = hospital['name'] if hospital else "Unknown"
    return jsonify(requests)
