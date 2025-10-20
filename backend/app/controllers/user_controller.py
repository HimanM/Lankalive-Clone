from flask import Blueprint, jsonify, request
from app.config.session import SessionLocal
from app.services.user_service import UserService
from app.models.user import User

bp = Blueprint('users', __name__, url_prefix='/api/users')


@bp.route('/', methods=['GET'])
def list_users():
    with SessionLocal() as session:
        svc = UserService(session)
        # naive listing via query in DAO not provided — use session directly
        users = session.query(User).order_by(User.created_at.desc()).all()
        return jsonify([{'id': str(u.id), 'email': u.email, 'name': u.name} for u in users])


@bp.route('/', methods=['POST'])
def create_user():
    data = request.json or {}
    u = User(name=data.get('name'), email=data.get('email'), password_hash=data.get('password_hash'))
    with SessionLocal() as session:
        svc = UserService(session)
        created = svc.create(u)
        return jsonify({'id': str(created.id)}), 201
