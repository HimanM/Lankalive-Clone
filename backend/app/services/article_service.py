from sqlalchemy.orm import Session
from typing import List, Optional
from app.dao.article_dao import ArticleDAO
from app.models.article import Article
from uuid import UUID


class ArticleService:
    def __init__(self, session: Session):
        self.session = session
        self.dao = ArticleDAO(session)

    def get(self, article_id: UUID) -> Optional[Article]:
        return self.dao.get(article_id)

    def list(self, limit: int = 20, offset: int = 0) -> List[Article]:
        return self.dao.list(limit=limit, offset=offset)

    def create(self, article: Article) -> Article:
        created = self.dao.create(article)
        self.session.commit()
        return created

    def update(self, article: Article) -> Article:
        updated = self.dao.update(article)
        self.session.commit()
        return updated

    def delete(self, article: Article) -> None:
        self.dao.delete(article)
        self.session.commit()

