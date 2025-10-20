from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.media import MediaAsset
from uuid import UUID


class MediaDAO:
    def __init__(self, session: Session):
        self.session = session

    def get(self, media_id: UUID) -> Optional[MediaAsset]:
        return self.session.query(MediaAsset).get(media_id)

    def list(self, limit: int = 100, offset: int = 0) -> List[MediaAsset]:
        return self.session.query(MediaAsset).order_by(MediaAsset.created_at.desc()).limit(limit).offset(offset).all()

    def create(self, media: MediaAsset) -> MediaAsset:
        self.session.add(media)
        self.session.flush()
        return media

    def delete(self, media: MediaAsset) -> None:
        self.session.delete(media)
        self.session.flush()
