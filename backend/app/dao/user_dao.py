from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.user import User
from uuid import UUID


class UserDAO:
    def __init__(self, session: Session):
        self.session = session

    def get(self, user_id: UUID) -> Optional[User]:
        return self.session.query(User).get(user_id)

    def get_by_email(self, email: str) -> Optional[User]:
        return self.session.query(User).filter(User.email == email).first()

    def create(self, user: User) -> User:
        self.session.add(user)
        self.session.flush()
        return user

    def update(self, user: User) -> User:
        self.session.add(user)
        self.session.flush()
        return user

    def delete(self, user: User) -> None:
        self.session.delete(user)
        self.session.flush()
