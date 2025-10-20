from flask import Blueprint, jsonify, request
from app.config.session import SessionLocal
from app.services.article_service import ArticleService
from app.models.article import Article
from app.controllers.decorators import requires_role

bp = Blueprint('articles', __name__, url_prefix='/api/articles')


@bp.route('/', methods=['GET'])
def list_articles():
    limit = int(request.args.get('limit', 20))
    offset = int(request.args.get('offset', 0))
    with SessionLocal() as session:
        svc = ArticleService(session)
        articles = svc.list(limit=limit, offset=offset)
        # basic serialization
        result = [
            {
                'id': str(a.id),
                'title': a.title,
                'slug': a.slug,
                'summary': a.summary,
                'published_at': a.published_at.isoformat() if a.published_at else None,
            }
            for a in articles
        ]
        return jsonify(result)


@bp.route('/<string:slug>', methods=['GET'])
def get_article(slug):
    with SessionLocal() as session:
        svc = ArticleService(session)
        a = svc.dao.get_by_slug(slug)
        if not a:
            return jsonify({'error': 'not found'}), 404
        return jsonify({'id': str(a.id), 'title': a.title, 'body': a.body_richtext, 'slug': a.slug})


@bp.route('/', methods=['POST'])
@requires_role('admin')
def create_article():
    data = request.json or {}
    a = Article(
        title=data.get('title'),
        summary=data.get('summary'),
        body_richtext=data.get('body'),
        slug=data.get('slug'),
    )
    with SessionLocal() as session:
        svc = ArticleService(session)
        created = svc.create(a)
        return jsonify({'id': str(created.id)}), 201


