from flask import Blueprint, jsonify, request
from app.config.session import SessionLocal
from app.services.homepage_section_service import HomepageSectionService
from app.models.homepage_section import HomepageSection

bp = Blueprint('homepage_sections', __name__, url_prefix='/api/homepage_sections')


@bp.route('/', methods=['GET'])
def list_sections():
    with SessionLocal() as session:
        svc = HomepageSectionService(session)
        secs = svc.list()
        return jsonify([{'id': str(s.id), 'key': s.key, 'title': s.title} for s in secs])


@bp.route('/', methods=['POST'])
def create_section():
    data = request.json or {}
    s = HomepageSection(key=data.get('key'), title=data.get('title'), layout_type=data.get('layout_type'))
    with SessionLocal() as session:
        svc = HomepageSectionService(session)
        created = svc.create(s)
        return jsonify({'id': str(created.id)}), 201
