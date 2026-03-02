import jwt
from flask import request, jsonify, current_app
from functools import wraps
from bson import ObjectId

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]

        if not token:
            return jsonify({"message": "Token is missing"}), 401

        try:
            data = jwt.decode(token, current_app.config["JWT_SECRET_KEY"], algorithms=["HS256"])
            current_user_id = data["user_id"]
            role = data["role"]
        except Exception as e:
            return jsonify({"message": "Token is invalid"}), 401

        return f(current_user_id, role, *args, **kwargs)
    return decorated

def roles_allowed(*roles):
    def wrapper(f):
        @wraps(f)
        def decorated(current_user_id, role, *args, **kwargs):
            if role not in roles:
                return jsonify({"message": f"Unauthorized: {role} role not allowed"}), 403
            return f(current_user_id, role, *args, **kwargs)
        return decorated
    return wrapper
