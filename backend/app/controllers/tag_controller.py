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
    import uuid
    data = request.json or {}
    t = Tag(
        id=uuid.uuid4(),
        name=data.get('name'), 
        slug=data.get('slug')
    )
    with SessionLocal() as session:
        svc = TagService(session)
        created = svc.create(t)
        return jsonify({'id': str(created.id)}), 201


@bp.route('/<string:tag_id>', methods=['PUT'])
@requires_role('admin')
def update_tag(tag_id):
    from uuid import UUID
    data = request.json or {}
    
    with SessionLocal() as session:
        svc = TagService(session)
        tag = svc.dao.get(UUID(tag_id))
        if not tag:
            return jsonify({'error': 'not found'}), 404
        
        if 'name' in data:
            tag.name = data['name']
        if 'slug' in data:
            tag.slug = data['slug']
        
        updated = svc.update(tag)
        return jsonify({'id': str(updated.id), 'name': updated.name})


@bp.route('/<string:tag_id>', methods=['DELETE'])
@requires_role('admin')
def delete_tag(tag_id):
    from uuid import UUID
    
    with SessionLocal() as session:
        svc = TagService(session)
        tag = svc.dao.get(UUID(tag_id))
        if not tag:
            return jsonify({'error': 'not found'}), 404
        
        svc.delete(tag)
        return jsonify({'message': 'deleted'}), 200
