from flask import Blueprint, jsonify

bp = Blueprint('articles', __name__, url_prefix='/api/articles')


@bp.route('/')
def list_articles():
    # placeholder; real implementation should use services
    return jsonify({'articles': []})

