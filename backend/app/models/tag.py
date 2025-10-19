from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import Base


class Tag(Base):
	__tablename__ = 'tags'

	id = Column(UUID(as_uuid=True), primary_key=True)
	name = Column(String(255), nullable=False)
	slug = Column(String(255), nullable=False, unique=True)

	articles = relationship('Article', secondary='article_tag', back_populates='tags')

