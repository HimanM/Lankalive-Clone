from app.controllers.article_controller import bp as articles_bp


def register_controllers(app):
	app.register_blueprint(articles_bp)

__all__ = ['register_controllers']

