from sqlalchemy import Column, String, Integer, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.models.base import Base


class MediaAsset(Base):
	__tablename__ = 'media_assets'

	id = Column(UUID(as_uuid=True), primary_key=True)
	type = Column(String(50), nullable=False)
	file_name = Column(String(1024), nullable=False)
	url = Column(String(2048), nullable=False)
	width = Column(Integer)
	height = Column(Integer)
	mime_type = Column(String(100))
	alt_text = Column(String(1024))
	caption = Column(Text)
	credit = Column(String(255))
	created_at = Column(DateTime(timezone=True), server_default=func.now())

