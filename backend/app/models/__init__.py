
from sqlalchemy import Table, Column, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from .base import Base

# association tables
article_category = Table(
	'article_category', Base.metadata,
	Column('article_id', UUID(as_uuid=True), ForeignKey('articles.id'), primary_key=True),
	Column('category_id', UUID(as_uuid=True), ForeignKey('categories.id'), primary_key=True)
)

article_tag = Table(
	'article_tag', Base.metadata,
	Column('article_id', UUID(as_uuid=True), ForeignKey('articles.id'), primary_key=True),
	Column('tag_id', UUID(as_uuid=True), ForeignKey('tags.id'), primary_key=True)
)

