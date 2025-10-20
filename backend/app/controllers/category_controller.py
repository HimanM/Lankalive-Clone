from flask import Blueprint, jsonify, request
from app.config.session import SessionLocal
from app.services.category_service import CategoryService
from app.models.category import Category
from app.controllers.decorators import requires_role

bp = Blueprint('categories', __name__, url_prefix='/api/categories')


@bp.route('/', methods=['GET'])
def list_categories():
    with SessionLocal() as session:
        svc = CategoryService(session)
        cats = svc.list()
        return jsonify([{'id': str(c.id), 'name': c.name, 'slug': c.slug} for c in cats])


@bp.route('/', methods=['POST'])
@requires_role('admin')
def create_category():
    data = request.json or {}
    c = Category(name=data.get('name'), slug=data.get('slug'))
    with SessionLocal() as session:
        svc = CategoryService(session)
        created = svc.create(c)
        return jsonify({'id': str(created.id)}), 201
