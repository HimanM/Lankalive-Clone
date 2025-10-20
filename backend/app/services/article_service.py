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

    def list(self, limit: int = 20, offset: int = 0, category_slug: str = None, 
             is_highlight: bool = None, status: str = 'published') -> List[Article]:
        return self.dao.list(
            limit=limit, 
            offset=offset, 
            category_slug=category_slug,
            is_highlight=is_highlight,
            status=status
        )

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
    
    def create_with_relations(self, article: Article, category_ids: List[UUID] = None, 
                             tag_ids: List[UUID] = None) -> Article:
        """Create article with categories and tags."""
        # Create article first
        created = self.dao.create(article)
        
        # Set categories (always include primary_category_id if set)
        if category_ids is not None or article.primary_category_id:
            all_category_ids = list(category_ids) if category_ids else []
            if article.primary_category_id and article.primary_category_id not in all_category_ids:
                all_category_ids.insert(0, article.primary_category_id)
            if all_category_ids:
                self.dao.set_categories(created, all_category_ids)
        
        # Set tags
        if tag_ids:
            self.dao.set_tags(created, tag_ids)
        
        self.session.commit()
        return created
    
    def update_with_relations(self, article: Article, category_ids: List[UUID] = None, 
                             tag_ids: List[UUID] = None) -> Article:
        """Update article with categories and tags."""
        # Update article fields
        updated = self.dao.update(article)
        
        # Update categories if provided (always include primary_category_id if set)
        if category_ids is not None:
            all_category_ids = list(category_ids)
            if article.primary_category_id and article.primary_category_id not in all_category_ids:
                all_category_ids.insert(0, article.primary_category_id)
            self.dao.set_categories(updated, all_category_ids)
        
        # Update tags if provided
        if tag_ids is not None:
            self.dao.set_tags(updated, tag_ids)
        
        self.session.commit()
        return updated

