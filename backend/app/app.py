import sys
from pathlib import Path

# Ensure the package parent (backend/) is on sys.path so `import app.*` works when
# running from inside the `app` directory (e.g. `python -m app.app` executed in
# d:\Lankalive\backend\app). This makes imports robust for different CWDs.
root = Path(__file__).resolve().parents[1]
if str(root) not in sys.path:
    sys.path.insert(0, str(root))

from flask import Flask
from app.controllers.article_controller import bp as articles_bp
from app.controllers.category_controller import bp as categories_bp
from app.controllers.tag_controller import bp as tags_bp
from app.controllers.media_controller import bp as media_bp
from app.controllers.user_controller import bp as users_bp
from app.controllers.homepage_section_controller import bp as sections_bp
from app.controllers.homepage_section_item_controller import bp as items_bp


def create_app():
    app = Flask(__name__, static_folder='static')

    # register blueprints
    app.register_blueprint(articles_bp)
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
from flask import Flask
from app.controllers import register_controllers


def create_app(config_object: str = None):
    app = Flask(__name__, static_folder='static', static_url_path='/static')
    if config_object:
        app.config.from_object(config_object)

    # Register controllers (blueprints)
    register_controllers(app)

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=8000, debug=True)
