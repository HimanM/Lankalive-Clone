from sqlalchemy.orm import Session
from typing import Optional
from app.dao.user_dao import UserDAO
from app.models.user import User
from uuid import UUID


class UserService:
    def __init__(self, session: Session):
        self.session = session
        self.dao = UserDAO(session)

    def get(self, user_id: UUID) -> Optional[User]:
        return self.dao.get(user_id)

    def get_by_email(self, email: str) -> Optional[User]:
        return self.dao.get_by_email(email)

    def create(self, user: User) -> User:
        created = self.dao.create(user)
        self.session.commit()
        return created

    def update(self, user: User) -> User:
        updated = self.dao.update(user)
        self.session.commit()
        return updated

    def delete(self, user: User) -> None:
        self.dao.delete(user)
        self.session.commit()
