from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import Base


class HomepageSection(Base):
	__tablename__ = 'homepage_sections'

	id = Column(UUID(as_uuid=True), primary_key=True)
	key = Column(String(100), nullable=False, unique=True)
	title = Column(String(255))
	layout_type = Column(String(100))
	# config_json stored in DB as JSONB; mapping handled via DAO/service

