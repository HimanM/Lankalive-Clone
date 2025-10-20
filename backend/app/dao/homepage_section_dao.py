from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.homepage_section import HomepageSection
from uuid import UUID


class HomepageSectionDAO:
    def __init__(self, session: Session):
        self.session = session

    def get(self, section_id: UUID) -> Optional[HomepageSection]:
        return self.session.query(HomepageSection).get(section_id)

    def get_by_key(self, key: str) -> Optional[HomepageSection]:
        return self.session.query(HomepageSection).filter(HomepageSection.key == key).first()

    def list(self, limit: int = 50, offset: int = 0) -> List[HomepageSection]:
        return self.session.query(HomepageSection).order_by(HomepageSection.key).limit(limit).offset(offset).all()

    def create(self, section: HomepageSection) -> HomepageSection:
        self.session.add(section)
        self.session.flush()
        return section

    def update(self, section: HomepageSection) -> HomepageSection:
        self.session.add(section)
        self.session.flush()
        return section

    def delete(self, section: HomepageSection) -> None:
        self.session.delete(section)
        self.session.flush()
