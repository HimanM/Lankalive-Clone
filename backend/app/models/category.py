from sqlalchemy import Column, String, Integer, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import Base


class Category(Base):
	__tablename__ = 'categories'

	id = Column(UUID(as_uuid=True), primary_key=True)
	name = Column(String(255), nullable=False)
	slug = Column(String(255), nullable=False, unique=True)
	order_index = Column(Integer, default=0)
	is_active = Column(Boolean, default=True)

	articles = relationship('Article', secondary='article_category', back_populates='categories')

