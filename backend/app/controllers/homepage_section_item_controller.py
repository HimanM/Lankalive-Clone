from flask import Blueprint, jsonify, request
from app.config.session import SessionLocal
from app.services.homepage_section_item_service import HomepageSectionItemService
from app.models.homepage_section_item import HomepageSectionItem
from uuid import UUID

bp = Blueprint('homepage_section_items', __name__, url_prefix='/api/homepage_section_items')


@bp.route('/section/<string:section_id>', methods=['GET'])
def list_items(section_id: str):
    with SessionLocal() as session:
        svc = HomepageSectionItemService(session)
        items = svc.list_for_section(UUID(section_id))
        return jsonify([{'id': str(i.id), 'article_id': str(i.article_id), 'order_index': i.order_index} for i in items])


@bp.route('/', methods=['POST'])
def create_item():
    data = request.json or {}
    item = HomepageSectionItem(section_id=data.get('section_id'), article_id=data.get('article_id'), order_index=data.get('order_index', 0))
    with SessionLocal() as session:
        svc = HomepageSectionItemService(session)
        created = svc.create(item)
        return jsonify({'id': str(created.id)}), 201
