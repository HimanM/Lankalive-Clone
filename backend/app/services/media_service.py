from sqlalchemy.orm import Session
from typing import List, Optional
from app.dao.media_dao import MediaDAO
from app.models.media import MediaAsset
from uuid import UUID


class MediaService:
    def __init__(self, session: Session):
        self.session = session
        self.dao = MediaDAO(session)

    def get(self, media_id: UUID) -> Optional[MediaAsset]:
        return self.dao.get(media_id)

    def list(self, limit: int = 100, offset: int = 0, q: str = None) -> List[MediaAsset]:
        return self.dao.list(limit=limit, offset=offset, q=q)

    def create(self, media: MediaAsset) -> MediaAsset:
        created = self.dao.create(media)
        self.session.commit()
        return created

    def delete(self, media: MediaAsset) -> None:
        self.dao.delete(media)
        self.session.commit()
