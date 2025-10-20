from flask import Blueprint, request, jsonify
from app.config.session import SessionLocal
from app.services.user_service import UserService
from app.controllers.decorators import create_access_token

try:
    import bcrypt
except Exception:
    bcrypt = None

bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@bp.route('/login', methods=['POST'])
def login():
    data = request.json or {}
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'error': 'email and password required'}), 400
    # Verify bcrypt hash
    with SessionLocal() as session:
        svc = UserService(session)
        user = svc.get_by_email(email)
        if not user:
            return jsonify({'error': 'invalid credentials'}), 401
        if not bcrypt:
            return jsonify({'error': 'bcrypt not installed on server; cannot verify password'}), 500
        try:
            ok = bcrypt.checkpw(password.encode(), user.password_hash.encode())
        except Exception:
            return jsonify({'error': 'password verification failed'}), 401
        if not ok:
            return jsonify({'error': 'invalid credentials'}), 401
        # create JWT
        try:
            token = create_access_token(identity=str(user.id), role=user.role)
        except Exception as e:
            return jsonify({'error': f'token creation failed: {e}'}), 500
        return jsonify({'access_token': token})
