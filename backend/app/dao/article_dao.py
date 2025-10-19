from app.models.article import Article


class ArticleDAO:
    """Data access layer for Article model."""

    def __init__(self, session):
        self.session = session

    def get(self, article_id):
        return self.session.query(Article).get(article_id)

    def list(self, limit=20, offset=0):
        return self.session.query(Article).order_by(Article.created_at.desc()).limit(limit).offset(offset).all()

    # Additional DAO methods to be implemented
