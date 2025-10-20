from sqlalchemy.orm import Session
from typing import List, Optional
from app.dao.homepage_section_dao import HomepageSectionDAO
from app.models.homepage_section import HomepageSection
from uuid import UUID


class HomepageSectionService:
    def __init__(self, session: Session):
        self.session = session
        self.dao = HomepageSectionDAO(session)

    def get(self, section_id: UUID) -> Optional[HomepageSection]:
        return self.dao.get(section_id)

    def get_by_key(self, key: str) -> Optional[HomepageSection]:
        return self.dao.get_by_key(key)

    def list(self, limit: int = 50, offset: int = 0) -> List[HomepageSection]:
        return self.dao.list(limit=limit, offset=offset)

    def create(self, section: HomepageSection) -> HomepageSection:
        created = self.dao.create(section)
        self.session.commit()
        return created

    def update(self, section: HomepageSection) -> HomepageSection:
        updated = self.dao.update(section)
        self.session.commit()
        return updated

    def delete(self, section: HomepageSection) -> None:
        self.dao.delete(section)
        self.session.commit()
