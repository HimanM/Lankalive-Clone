from flask import Blueprint, jsonify, request
from app.config.session import SessionLocal
from app.services.category_service import CategoryService
from app.services.article_service import ArticleService
from app.models.category import Category
from app.controllers.decorators import requires_role

bp = Blueprint('categories', __name__, url_prefix='/api/categories')


@bp.route('/', methods=['GET'])
def list_categories():
    with SessionLocal() as session:
        svc = CategoryService(session)
        cats = svc.list()
        return jsonify([{'id': str(c.id), 'name': c.name, 'slug': c.slug} for c in cats])


@bp.route('/<string:slug>', methods=['GET'])
def get_category(slug):
    """Get category details with articles"""
    with SessionLocal() as session:
        svc = CategoryService(session)
        category = svc.dao.get_by_slug(slug)
        if not category:
            return jsonify({'error': 'not found'}), 404
        
        article_svc = ArticleService(session)
        
        limit = int(request.args.get('limit', 20))
        offset = int(request.args.get('offset', 0))
        
        articles = article_svc.list(
            limit=limit,
            offset=offset,
            category_slug=slug,
            status='published'
        )
        
        return jsonify({
            'id': str(category.id),
            'name': category.name,
            'slug': category.slug,
            'articles': [
                {
                    'id': str(a.id),
                    'title': a.title,
                    'slug': a.slug,
                    'summary': a.summary,
                    'hero_image_url': a.hero_image_url,
                    'published_at': a.published_at.isoformat() if a.published_at else None,
                }
                for a in articles
            ]
        })


@bp.route('/', methods=['POST'])
@requires_role('admin')
def create_category():
    import uuid
    data = request.json or {}
    c = Category(
        id=uuid.uuid4(),
        name=data.get('name'), 
        slug=data.get('slug')
    )
    with SessionLocal() as session:
        svc = CategoryService(session)
        created = svc.create(c)
        return jsonify({'id': str(created.id)}), 201


@bp.route('/<string:category_id>', methods=['PUT'])
@requires_role('admin')
def update_category(category_id):
    from uuid import UUID
    data = request.json or {}
    
    with SessionLocal() as session:
        svc = CategoryService(session)
        category = svc.dao.get(UUID(category_id))
        if not category:
            return jsonify({'error': 'not found'}), 404
        
        if 'name' in data:
            category.name = data['name']
        if 'slug' in data:
            category.slug = data['slug']
        
        updated = svc.update(category)
        return jsonify({'id': str(updated.id), 'name': updated.name})


@bp.route('/<string:category_id>', methods=['DELETE'])
@requires_role('admin')
def delete_category(category_id):
    from uuid import UUID
    
    with SessionLocal() as session:
        svc = CategoryService(session)
        category = svc.dao.get(UUID(category_id))
        if not category:
            return jsonify({'error': 'not found'}), 404
        
        svc.delete(category)
        return jsonify({'message': 'deleted'}), 200
