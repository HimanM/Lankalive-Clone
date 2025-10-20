from sqlalchemy.orm import Session
from typing import List, Optional
from app.dao.tag_dao import TagDAO
from app.models.tag import Tag
from uuid import UUID


class TagService:
    def __init__(self, session: Session):
        self.session = session
        self.dao = TagDAO(session)

    def get(self, tag_id: UUID) -> Optional[Tag]:
        return self.dao.get(tag_id)

    def list(self, limit: int = 100, offset: int = 0) -> List[Tag]:
        return self.dao.list(limit=limit, offset=offset)

    def create(self, tag: Tag) -> Tag:
        created = self.dao.create(tag)
        self.session.commit()
        return created

    def update(self, tag: Tag) -> Tag:
        updated = self.dao.update(tag)
        self.session.commit()
        return updated

    def delete(self, tag: Tag) -> None:
        self.dao.delete(tag)
        self.session.commit()
