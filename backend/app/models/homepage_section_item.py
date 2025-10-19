from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.models.base import Base


class HomepageSectionItem(Base):
	__tablename__ = 'homepage_section_items'

	id = Column(UUID(as_uuid=True), primary_key=True)
	section_id = Column(UUID(as_uuid=True), ForeignKey('homepage_sections.id'))
	article_id = Column(UUID(as_uuid=True), ForeignKey('articles.id'))
	order_index = Column(Integer, default=0)
	pin_start_at = Column(DateTime(timezone=True))
	pin_end_at = Column(DateTime(timezone=True))

	# relationships left minimal; services/DAO will handle joins

