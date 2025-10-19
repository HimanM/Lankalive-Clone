from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.models.base import Base

class Article(Base):
	__tablename__ = 'articles'

	id = Column(UUID(as_uuid=True), primary_key=True)
	status = Column(String(32), nullable=False, default='draft')
	title = Column(String(1024), nullable=False)
	summary = Column(Text)
	body_richtext = Column(Text)
	slug = Column(String(1024), unique=True)
	primary_category_id = Column(UUID(as_uuid=True), ForeignKey('categories.id'))
	hero_image_url = Column(String(2048))
	is_breaking = Column(Boolean, default=False)
	is_highlight = Column(Boolean, default=False)
	is_featured = Column(Boolean, default=False)
	published_at = Column(DateTime(timezone=True))
	embargo_at = Column(DateTime(timezone=True))
	unpublish_at = Column(DateTime(timezone=True))
	created_at = Column(DateTime(timezone=True), server_default=func.now())
	updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

	primary_category = relationship('Category', back_populates='articles')
	categories = relationship('Category', secondary='article_category', back_populates='articles')
	tags = relationship('Tag', secondary='article_tag', back_populates='articles')

