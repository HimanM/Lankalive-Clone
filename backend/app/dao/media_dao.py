from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.media import MediaAsset
from uuid import UUID


class MediaDAO:
    def __init__(self, session: Session):
        self.session = session

    def get(self, media_id: UUID) -> Optional[MediaAsset]:
        return self.session.query(MediaAsset).get(media_id)

    def list(self, limit: int = 100, offset: int = 0, q: str = None) -> List[MediaAsset]:
        """List media assets, optional search by filename, alt_text, caption or credit."""
        query = self.session.query(MediaAsset).order_by(MediaAsset.created_at.desc())
        if q:
            like = f"%{q}%"
            query = query.filter(
                (MediaAsset.file_name.ilike(like)) |
                (MediaAsset.alt_text.ilike(like)) |
                (MediaAsset.caption.ilike(like)) |
                (MediaAsset.credit.ilike(like))
            )
        return query.limit(limit).offset(offset).all()

    def list_with_count(self, limit: int = 100, offset: int = 0, q: str = None):
        """Return a tuple (items, total_count) applying optional search."""
        query = self.session.query(MediaAsset)
        if q:
            like = f"%{q}%"
            query = query.filter(
                (MediaAsset.file_name.ilike(like)) |
                (MediaAsset.alt_text.ilike(like)) |
                (MediaAsset.caption.ilike(like)) |
                (MediaAsset.credit.ilike(like))
            )

        total = query.count()
        items = query.order_by(MediaAsset.created_at.desc()).limit(limit).offset(offset).all()
        return items, total

    def create(self, media: MediaAsset) -> MediaAsset:
        self.session.add(media)
        self.session.flush()
        return media

    def delete(self, media: MediaAsset) -> None:
        self.session.delete(media)
        self.session.flush()
