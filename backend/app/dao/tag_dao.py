from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.tag import Tag
from uuid import UUID


class TagDAO:
    def __init__(self, session: Session):
        self.session = session

    def get(self, tag_id: UUID) -> Optional[Tag]:
        return self.session.query(Tag).get(tag_id)

    def get_by_slug(self, slug: str) -> Optional[Tag]:
        return self.session.query(Tag).filter(Tag.slug == slug).first()

    def list(self, limit: int = 100, offset: int = 0) -> List[Tag]:
        return self.session.query(Tag).order_by(Tag.name).limit(limit).offset(offset).all()

    def create(self, tag: Tag) -> Tag:
        self.session.add(tag)
        self.session.flush()
        return tag

    def update(self, tag: Tag) -> Tag:
        self.session.add(tag)
        self.session.flush()
        return tag

    def delete(self, tag: Tag) -> None:
        self.session.delete(tag)
        self.session.flush()
