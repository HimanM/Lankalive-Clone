import sys
from pathlib import Path

# Ensure the package parent (backend/) is on sys.path so `import app.*` works when
# running from inside the `app` directory (e.g. `python -m app.app` executed in
# d:\Lankalive\backend\app). This makes imports robust for different CWDs.
root = Path(__file__).resolve().parents[1]
if str(root) not in sys.path:
    sys.path.insert(0, str(root))

from flask import Flask, send_from_directory
from app.controllers.article_controller import bp as articles_bp
from app.controllers.category_controller import bp as categories_bp
from app.controllers.tag_controller import bp as tags_bp
from app.controllers.media_controller import bp as media_bp
from app.controllers.user_controller import bp as users_bp
from app.controllers.homepage_section_controller import bp as sections_bp
from app.controllers.homepage_section_item_controller import bp as items_bp
from app.controllers.auth_controller import bp as auth_bp
from flask import request
import os

# Try to import Flask-CORS; if unavailable we'll fall back to a permissive after_request.
try:
    from flask_cors import CORS
except Exception:
    CORS = None


def create_app():
    # Set static_folder to absolute path relative to backend directory
    static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static')
    app = Flask(__name__, static_folder=static_dir, static_url_path='/static')

    # Add route to serve uploaded files
    @app.route('/static/uploads/<path:filename>')
    def serve_upload(filename):
        uploads_dir = os.path.join(static_dir, 'uploads')
        return send_from_directory(uploads_dir, filename)

    # Enable CORS for development: prefer flask_cors if installed.
    if CORS:
        CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    else:
        @app.after_request
        def _cors_response(response):
            # permissive CORS for local dev (adjust in production)
            response.headers['Access-Control-Allow-Origin'] = request.headers.get('Origin', '*') or '*'
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Authorization,Content-Type'
            return response
    # register blueprints
    app.register_blueprint(articles_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(categories_bp)
    app.register_blueprint(tags_bp)
    app.register_blueprint(media_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(sections_bp)
    app.register_blueprint(items_bp)

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=8000, debug=True)

