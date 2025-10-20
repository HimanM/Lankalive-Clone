from sqlalchemy.orm import Session
from typing import List, Optional, Dict
from app.dao.media_dao import MediaDAO
from app.models.media import MediaAsset
from app.models.article import Article
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

    def check_usage_in_published_articles(self, media: MediaAsset) -> Dict:
        """
        Check if media is used in any published articles.
        Returns dict with 'can_delete' boolean and list of 'articles' using it.
        """
        # Find articles where this media appears in hero_image_url or body_richtext
        # and status is 'published'
        published_articles = self.session.query(Article).filter(
            Article.status == 'published',
            (Article.hero_image_url.like(f'%{media.url}%')) | 
            (Article.body_richtext.like(f'%{media.url}%'))
        ).all()
        
        can_delete = len(published_articles) == 0
        
        return {
            'can_delete': can_delete,
            'articles': [
                {
                    'id': str(a.id),
                    'title': a.title,
                    'status': a.status,
                    'slug': a.slug
                }
                for a in published_articles
            ]
        }

    def delete(self, media: MediaAsset) -> None:
        self.dao.delete(media)
        self.session.commit()
