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
