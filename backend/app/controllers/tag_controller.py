from flask import Blueprint, jsonify, request
from app.config.session import SessionLocal
from app.services.tag_service import TagService
from app.models.tag import Tag
from app.controllers.decorators import requires_role

bp = Blueprint('tags', __name__, url_prefix='/api/tags')


@bp.route('/', methods=['GET'])
def list_tags():
    with SessionLocal() as session:
        svc = TagService(session)
        tags = svc.list()
        return jsonify([{'id': str(t.id), 'name': t.name, 'slug': t.slug} for t in tags])


@bp.route('/', methods=['POST'])
@requires_role('admin')
def create_tag():
    data = request.json or {}
    t = Tag(name=data.get('name'), slug=data.get('slug'))
    with SessionLocal() as session:
        svc = TagService(session)
        created = svc.create(t)
        return jsonify({'id': str(created.id)}), 201
