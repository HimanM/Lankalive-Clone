from app.dao.article_dao import ArticleDAO


class ArticleService:
    def __init__(self, dao: ArticleDAO):
        self.dao = dao

    def get_article(self, article_id):
        return self.dao.get(article_id)

    def list_articles(self, limit=20, offset=0):
        return self.dao.list(limit=limit, offset=offset)

    # Additional service methods to be implemented
