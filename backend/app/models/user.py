from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.models.base import Base


class User(Base):
	__tablename__ = 'users'

	id = Column(UUID(as_uuid=True), primary_key=True)
	name = Column(String(255), nullable=False)
	email = Column(String(320), nullable=False, unique=True)
	password_hash = Column(String(1024), nullable=False)
	role = Column(String(50), nullable=False, default='admin')
	last_login_at = Column(DateTime(timezone=True))
	created_at = Column(DateTime(timezone=True), server_default=func.now())
	updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

