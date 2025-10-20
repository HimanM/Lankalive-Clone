from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.homepage_section_item import HomepageSectionItem
from uuid import UUID


class HomepageSectionItemDAO:
    def __init__(self, session: Session):
        self.session = session

    def get(self, item_id: UUID) -> Optional[HomepageSectionItem]:
        return self.session.query(HomepageSectionItem).get(item_id)

    def list_for_section(self, section_id: UUID, limit: int = 100, offset: int = 0) -> List[HomepageSectionItem]:
        return (
            self.session.query(HomepageSectionItem)
            .filter(HomepageSectionItem.section_id == section_id)
            .order_by(HomepageSectionItem.order_index)
            .limit(limit)
            .offset(offset)
            .all()
        )

    def create(self, item: HomepageSectionItem) -> HomepageSectionItem:
        self.session.add(item)
        self.session.flush()
        return item

    def delete(self, item: HomepageSectionItem) -> None:
        self.session.delete(item)
        self.session.flush()
