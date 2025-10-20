from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.article import Article
from uuid import UUID
from app.models.category import Category
from sqlalchemy import or_, and_
from datetime import datetime


class ArticleDAO:
    """Data access layer for Article model."""

    def __init__(self, session: Session):
        self.session = session

    def get(self, article_id: UUID) -> Optional[Article]:
        return self.session.query(Article).get(article_id)

    def get_by_slug(self, slug: str) -> Optional[Article]:
        return self.session.query(Article).filter(Article.slug == slug).first()

    def list(self, limit: int = 20, offset: int = 0, category_slug: str = None,
             is_highlight: bool = None, status: Optional[str] = 'published',
             date_from: str = None, date_to: str = None) -> List[Article]:
        
        
        query = self.session.query(Article).distinct()
        
        # Filter by status (None means no filter - show all statuses)
        if status is not None:
            query = query.filter(Article.status == status)
        
        # Filter by category - check both junction table AND primary_category
        if category_slug:
            # Get the category by slug first
            category = self.session.query(Category).filter(Category.slug == category_slug).first()
            if category:
                # Article matches if it's in the many-to-many OR it's the primary category
                query = query.outerjoin(Article.categories).filter(
                    or_(
                        Category.id == category.id,  # In junction table
                        Article.primary_category_id == category.id  # Is primary category
                    )
                )
            else:
                # Category doesn't exist, return empty
                return []
        
        # Filter by highlight
        if is_highlight is not None:
            query = query.filter(Article.is_highlight == is_highlight)
        
        # Filter by date range on published_at
        if date_from:
            try:
                date_from_obj = datetime.fromisoformat(date_from)
                query = query.filter(Article.published_at >= date_from_obj)
            except ValueError:
                pass  # Invalid date format, skip filter
        
        if date_to:
            try:
                # Add one day to include the entire end date
                date_to_obj = datetime.fromisoformat(date_to)
                from datetime import timedelta
                date_to_end = date_to_obj + timedelta(days=1)
                query = query.filter(Article.published_at < date_to_end)
            except ValueError:
                pass  # Invalid date format, skip filter
        
        return (
            query
            .order_by(Article.published_at.desc().nullslast(), Article.created_at.desc())
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
    
    def set_categories(self, article: Article, category_ids: List[UUID]) -> None:
        """Set article categories. Clears existing and adds new ones."""
        from app.models.category import Category
        from sqlalchemy import text
        
        # Delete existing relationships directly via SQL to avoid stale state issues
        self.session.execute(
            text("DELETE FROM article_category WHERE article_id = :article_id"),
            {"article_id": article.id}
        )
        self.session.flush()
        
        # Add new categories
        if category_ids:
            categories = self.session.query(Category).filter(Category.id.in_(category_ids)).all()
            for category in categories:
                self.session.execute(
                    text("INSERT INTO article_category (article_id, category_id) VALUES (:article_id, :category_id) ON CONFLICT DO NOTHING"),
                    {"article_id": article.id, "category_id": category.id}
                )
            self.session.flush()
            # Refresh the article to reload relationships
            self.session.expire(article, ['categories'])
    
    def set_tags(self, article: Article, tag_ids: List[UUID]) -> None:
        """Set article tags. Clears existing and adds new ones."""
        from app.models.tag import Tag
        from sqlalchemy import text
        
        # Delete existing relationships directly via SQL to avoid stale state issues
        self.session.execute(
            text("DELETE FROM article_tag WHERE article_id = :article_id"),
            {"article_id": article.id}
        )
        self.session.flush()
        
        # Add new tags
        if tag_ids:
            tags = self.session.query(Tag).filter(Tag.id.in_(tag_ids)).all()
            for tag in tags:
                self.session.execute(
                    text("INSERT INTO article_tag (article_id, tag_id) VALUES (:article_id, :tag_id) ON CONFLICT DO NOTHING"),
                    {"article_id": article.id, "tag_id": tag.id}
                )
            self.session.flush()
            # Refresh the article to reload relationships
            self.session.expire(article, ['tags'])

