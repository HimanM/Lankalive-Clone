from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.category import Category
from uuid import UUID


class CategoryDAO:
    def __init__(self, session: Session):
        self.session = session

    def get(self, category_id: UUID) -> Optional[Category]:
        return self.session.query(Category).get(category_id)

    def get_by_slug(self, slug: str) -> Optional[Category]:
        return self.session.query(Category).filter(Category.slug == slug).first()

    def list(self, limit: int = 50, offset: int = 0) -> List[Category]:
        return self.session.query(Category).order_by(Category.order_index).limit(limit).offset(offset).all()

    def create(self, category: Category) -> Category:
        self.session.add(category)
        self.session.flush()
        return category

    def update(self, category: Category) -> Category:
        self.session.add(category)
        self.session.flush()
        return category

    def delete(self, category: Category) -> None:
        self.session.delete(category)
        self.session.flush()
