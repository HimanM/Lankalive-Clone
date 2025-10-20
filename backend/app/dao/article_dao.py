from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.article import Article
from uuid import UUID


class ArticleDAO:
    """Data access layer for Article model."""

    def __init__(self, session: Session):
        self.session = session

    def get(self, article_id: UUID) -> Optional[Article]:
        return self.session.query(Article).get(article_id)

    def get_by_slug(self, slug: str) -> Optional[Article]:
        return self.session.query(Article).filter(Article.slug == slug).first()

    def list(self, limit: int = 20, offset: int = 0) -> List[Article]:
        return (
            self.session.query(Article)
            .order_by(Article.created_at.desc())
            .limit(limit)
            .offset(offset)
            .all()
        )

    def create(self, article: Article) -> Article:
        self.session.add(article)
        self.session.flush()
        return article

    def update(self, article: Article) -> Article:
        self.session.add(article)
        self.session.flush()
        return article

    def delete(self, article: Article) -> None:
        self.session.delete(article)
        self.session.flush()

