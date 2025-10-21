from flask import Blueprint, jsonify, request, current_app
from app.config.session import SessionLocal
from app.services.article_service import ArticleService
from app.models.article import Article
from app.controllers.decorators import requires_role, is_admin

bp = Blueprint('articles', __name__, url_prefix='/api/articles')


@bp.route('/', methods=['GET'])
def list_articles():
    limit = int(request.args.get('limit', 20))
    offset = int(request.args.get('offset', 0))
    category = request.args.get('category')  # category slug
    tag = request.args.get('tag')  # tag slug
    is_highlight = request.args.get('is_highlight')  # '1' or 'true'
    status = request.args.get('status', 'published')  # default to published for public
    date_from = request.args.get('dateFrom')  # YYYY-MM-DD format
    date_to = request.args.get('dateTo')  # YYYY-MM-DD format
    
    # For non-admin users, force status to 'published' regardless of query param
    if not is_admin():
        status = 'published'
    # For admin users, if status is 'all', set to None to skip filtering
    elif status == 'all':
        status = None
    
    with SessionLocal() as session:
        svc = ArticleService(session)
        articles = svc.list(
            limit=limit, 
            offset=offset, 
            category_slug=category,
            tag_slug=tag,
            is_highlight=is_highlight in ['1', 'true'] if is_highlight else None,
            status=status,
            date_from=date_from,
            date_to=date_to
        )
        # basic serialization
        result = []
        for a in articles:
            # Build categories list, ensuring primary_category is included
            categories = [{'id': str(c.id), 'name': c.name, 'slug': c.slug} for c in (a.categories or [])]
            
            # Add primary category if it exists and isn't already in the list
            if a.primary_category and not any(c['id'] == str(a.primary_category.id) for c in categories):
                categories.insert(0, {
                    'id': str(a.primary_category.id),
                    'name': a.primary_category.name,
                    'slug': a.primary_category.slug
                })
            
            result.append({
                'id': str(a.id),
                'title': a.title,
                'slug': a.slug,
                'summary': a.summary,
                'hero_image_url': a.hero_image_url,
                'published_at': a.published_at.isoformat() if a.published_at else None,
                'status': a.status,
                'categories': categories,
                'is_highlight': a.is_highlight,
                'is_breaking': a.is_breaking,
                'is_featured': a.is_featured,
            })
        
        return jsonify(result)


@bp.route('/by-id/<string:article_id>', methods=['GET'])
@requires_role('admin')
def get_article_by_id(article_id):
    """Get article by UUID - admin-only (for editing)"""
    from uuid import UUID
    with SessionLocal() as session:
        svc = ArticleService(session)
        a = svc.get(UUID(article_id))
        if not a:
            return jsonify({'error': 'not found'}), 404
        # serialize related fields
        categories = [{'id': str(c.id), 'name': c.name, 'slug': c.slug} for c in (a.categories or [])]
        tags = [{'id': str(t.id), 'name': t.name, 'slug': t.slug} for t in (a.tags or [])]
        return jsonify({
            'id': str(a.id),
            'title': a.title,
            'slug': a.slug,
            'summary': a.summary,
            'body': a.body_richtext,
            'hero_image_url': a.hero_image_url,
            'published_at': a.published_at.isoformat() if a.published_at else None,
            'status': a.status,
            'is_breaking': a.is_breaking,
            'is_highlight': a.is_highlight,
            'is_featured': a.is_featured,
            'primary_category_id': str(a.primary_category_id) if a.primary_category_id else None,
            'categories': categories,
            'tags': tags,
        })


@bp.route('/<string:slug>', methods=['GET'])
def get_article(slug):
    with SessionLocal() as session:
        svc = ArticleService(session)
        a = svc.dao.get_by_slug(slug)
        if not a:
            return jsonify({'error': 'not found'}), 404
        
        # Non-admin users can only view published articles
        if not is_admin() and a.status != 'published':
            # Log unauthorized access attempt for monitoring; keep returning 404 to avoid disclosure
            try:
                remote = request.remote_addr
                # decode token subject if present
                from app.controllers.decorators import get_current_user
                user = get_current_user()
                sub = user.get('sub') if user else None
                current_app.logger.warning(f"Unauthorized draft access attempt: slug={slug} remote={remote} sub={sub}")
            except Exception:
                try:
                    current_app.logger.warning(f"Unauthorized draft access attempt: slug={slug} remote={request.remote_addr}")
                except Exception:
                    pass
            return jsonify({'error': 'not found'}), 404
        
        # serialize related fields
        categories = [{'id': str(c.id), 'name': c.name, 'slug': c.slug} for c in (a.categories or [])]
        
        # Add primary category if it exists and isn't already in the list
        if a.primary_category and not any(c['id'] == str(a.primary_category.id) for c in categories):
            categories.insert(0, {
                'id': str(a.primary_category.id),
                'name': a.primary_category.name,
                'slug': a.primary_category.slug
            })
        
        tags = [{'id': str(t.id), 'name': t.name, 'slug': t.slug} for t in (a.tags or [])]
        return jsonify({
            'id': str(a.id),
            'title': a.title,
            'slug': a.slug,
            'summary': a.summary,
            'body': a.body_richtext,
            'hero_image_url': a.hero_image_url,
            'published_at': a.published_at.isoformat() if a.published_at else None,
            'status': a.status,
            'categories': categories,
            'tags': tags,
        })


@bp.route('/', methods=['POST'])
@requires_role('admin')
def create_article():
    data = request.json or {}
    import uuid
    from datetime import datetime
    
    a = Article(
        id=uuid.uuid4(),
        title=data.get('title'),
        summary=data.get('summary'),
        body_richtext=data.get('body'),
        slug=data.get('slug'),
        hero_image_url=data.get('hero_image_url'),
        primary_category_id=data.get('primary_category_id'),
        status=data.get('status', 'draft'),
        is_breaking=data.get('is_breaking', False),
        is_highlight=data.get('is_highlight', False),
        is_featured=data.get('is_featured', False),
        published_at=datetime.fromisoformat(data['published_at']) if data.get('published_at') else None,
    )
    
    # Parse category and tag IDs
    category_ids = [uuid.UUID(cid) for cid in data.get('category_ids', [])] if data.get('category_ids') else []
    tag_ids = [uuid.UUID(tid) for tid in data.get('tag_ids', [])] if data.get('tag_ids') else []
    
    with SessionLocal() as session:
        svc = ArticleService(session)
        created = svc.create_with_relations(a, category_ids, tag_ids)
        return jsonify({'id': str(created.id), 'slug': created.slug}), 201


@bp.route('/<string:article_id>', methods=['PUT'])
@requires_role('admin')
def update_article(article_id):
    from uuid import UUID
    from datetime import datetime
    import uuid
    
    data = request.json or {}
    with SessionLocal() as session:
        svc = ArticleService(session)
        article = svc.get(UUID(article_id))
        if not article:
            return jsonify({'error': 'not found'}), 404
        
        # Update fields
        if 'title' in data:
            article.title = data['title']
        if 'summary' in data:
            article.summary = data['summary']
        if 'body' in data:
            article.body_richtext = data['body']
        if 'slug' in data:
            article.slug = data['slug']
        if 'hero_image_url' in data:
            article.hero_image_url = data['hero_image_url']
        if 'primary_category_id' in data:
            article.primary_category_id = data['primary_category_id']
        if 'status' in data:
            article.status = data['status']
        if 'is_breaking' in data:
            article.is_breaking = data['is_breaking']
        if 'is_highlight' in data:
            article.is_highlight = data['is_highlight']
        if 'is_featured' in data:
            article.is_featured = data['is_featured']
        if 'published_at' in data:
            article.published_at = datetime.fromisoformat(data['published_at']) if data['published_at'] else None
        
        # Parse category and tag IDs if provided
        category_ids = [uuid.UUID(cid) for cid in data.get('category_ids', [])] if 'category_ids' in data else None
        tag_ids = [uuid.UUID(tid) for tid in data.get('tag_ids', [])] if 'tag_ids' in data else None
        
        # Update article with relations
        updated = svc.update_with_relations(article, category_ids, tag_ids)
        return jsonify({'id': str(updated.id), 'slug': updated.slug})


@bp.route('/<string:article_id>', methods=['DELETE'])
@requires_role('admin')
def delete_article(article_id):
    from uuid import UUID
    
    with SessionLocal() as session:
        svc = ArticleService(session)
        article = svc.get(UUID(article_id))
        if not article:
            return jsonify({'error': 'not found'}), 404
        
        svc.delete(article)
        return jsonify({'message': 'deleted'}), 200


