import json
import uuid
import pytest

from app.app import create_app


class SimpleObj:
    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)


def make_article_obj(slug='sample-breaking-story'):
    return SimpleObj(id=uuid.uuid4(), title='Sample', slug=slug, summary='sum', body_richtext='<p>body</p>', published_at=None)


def test_list_and_get_articles(monkeypatch):
    # Fake ArticleService used by controller
    class FakeArticleService:
        def __init__(self, session=None):
            self.dao = self

        def list(self, limit=20, offset=0):
            return [make_article_obj()]

        def get_by_slug(self, slug):
            return make_article_obj(slug=slug)

        def create(self, article):
            return SimpleObj(id=uuid.uuid4())

    monkeypatch.setattr('app.controllers.article_controller.ArticleService', FakeArticleService)

    app = create_app()
    client = app.test_client()

    r = client.get('/api/articles/')
    assert r.status_code == 200
    data = r.get_json()
    assert isinstance(data, list) and len(data) == 1

    r2 = client.get('/api/articles/test-slug')
    assert r2.status_code == 200
    j = r2.get_json()
    assert j.get('slug') == 'test-slug'

    r3 = client.post('/api/articles/', json={'title': 'x', 'summary': 's', 'body': 'b', 'slug': 'x'})
    assert r3.status_code == 201


def test_categories_and_tags(monkeypatch):
    class FakeCategoryService:
        def __init__(self, session=None):
            pass

        def list(self, limit=50, offset=0):
            return [SimpleObj(id=uuid.uuid4(), name='Political', slug='political-news')]

        def create(self, obj):
            return SimpleObj(id=uuid.uuid4())

    class FakeTagService:
        def __init__(self, session=None):
            pass

        def list(self, limit=100, offset=0):
            return [SimpleObj(id=uuid.uuid4(), name='breaking', slug='breaking')]

        def create(self, obj):
            return SimpleObj(id=uuid.uuid4())

    monkeypatch.setattr('app.controllers.category_controller.CategoryService', FakeCategoryService)
    monkeypatch.setattr('app.controllers.tag_controller.TagService', FakeTagService)

    app = create_app()
    client = app.test_client()

    rc = client.get('/api/categories/')
    assert rc.status_code == 200
    assert isinstance(rc.get_json(), list)

    rp = client.post('/api/categories/', json={'name': 'New', 'slug': 'new'})
    assert rp.status_code == 201

    rt = client.get('/api/tags/')
    assert rt.status_code == 200
    assert isinstance(rt.get_json(), list)

    rt2 = client.post('/api/tags/', json={'name': 't', 'slug': 't'})
    assert rt2.status_code == 201


def test_media_and_users_and_homepage(monkeypatch, tmp_path):
    # Media service
    class FakeMediaService:
        def __init__(self, session=None):
            pass

        def list(self, limit=100, offset=0):
            return [SimpleObj(id=uuid.uuid4(), url='/static/uploads/2025/10/hero1.jpg', file_name='hero1.jpg')]

        def create(self, media):
            return SimpleObj(id=uuid.uuid4(), url='/static/uploads/...')

    class FakeUserService:
        def __init__(self, session=None):
            pass

        def create(self, user):
            return SimpleObj(id=uuid.uuid4())

    class FakeSectionService:
        def __init__(self, session=None):
            pass

        def list(self, limit=50, offset=0):
            return [SimpleObj(id=uuid.uuid4(), key='highlights', title='Highlights')]

        def create(self, s):
            return SimpleObj(id=uuid.uuid4())

    class FakeItemService:
        def __init__(self, session=None):
            pass

        def list_for_section(self, section_id, limit=100, offset=0):
            return [SimpleObj(id=uuid.uuid4(), article_id=uuid.uuid4(), order_index=1)]

        def create(self, item):
            return SimpleObj(id=uuid.uuid4())

    monkeypatch.setattr('app.controllers.media_controller.MediaService', FakeMediaService)
    monkeypatch.setattr('app.controllers.user_controller.UserService', FakeUserService)
    monkeypatch.setattr('app.controllers.homepage_section_controller.HomepageSectionService', FakeSectionService)
    monkeypatch.setattr('app.controllers.homepage_section_item_controller.HomepageSectionItemService', FakeItemService)

    app = create_app()
    client = app.test_client()

    rm = client.get('/api/media/')
    assert rm.status_code == 200

    # user create
    ru = client.post('/api/users/', json={'name': 'Admin', 'email': 'a@b.c', 'password_hash': 'x'})
    assert ru.status_code == 201

    rs = client.get('/api/homepage_sections/')
    assert rs.status_code == 200

    rp = client.post('/api/homepage_section_items/', json={'section_id': str(uuid.uuid4()), 'article_id': str(uuid.uuid4())})
    assert rp.status_code == 201
