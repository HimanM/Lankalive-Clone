from sqlalchemy.orm import Session
from typing import List, Optional
from app.dao.homepage_section_item_dao import HomepageSectionItemDAO
from app.models.homepage_section_item import HomepageSectionItem
from uuid import UUID


class HomepageSectionItemService:
    def __init__(self, session: Session):
        self.session = session
        self.dao = HomepageSectionItemDAO(session)

    def list_for_section(self, section_id: UUID, limit: int = 100, offset: int = 0) -> List[HomepageSectionItem]:
        return self.dao.list_for_section(section_id=section_id, limit=limit, offset=offset)

    def create(self, item: HomepageSectionItem) -> HomepageSectionItem:
        created = self.dao.create(item)
        self.session.commit()
        return created

    def delete(self, item: HomepageSectionItem) -> None:
        self.dao.delete(item)
        self.session.commit()
