from sqlalchemy.orm import Session
from typing import List, Optional
from app.dao.category_dao import CategoryDAO
from app.models.category import Category
from uuid import UUID


class CategoryService:
    def __init__(self, session: Session):
        self.session = session
        self.dao = CategoryDAO(session)

    def get(self, category_id: UUID) -> Optional[Category]:
        return self.dao.get(category_id)

    def list(self, limit: int = 50, offset: int = 0) -> List[Category]:
        return self.dao.list(limit=limit, offset=offset)

    def create(self, category: Category) -> Category:
        created = self.dao.create(category)
        self.session.commit()
        return created

    def update(self, category: Category) -> Category:
        updated = self.dao.update(category)
        self.session.commit()
        return updated

    def delete(self, category: Category) -> None:
        self.dao.delete(category)
        self.session.commit()
