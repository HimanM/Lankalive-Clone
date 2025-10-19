# Lankalive-like News Site — MVP Functional Specification (Portfolio Project)

Date: 2025-10-19
Author: You

## Overview

Build a simple Lankalive-like news website focused on backend and admin content management. MVP is English-only, one Admin role, no ads, no SEO requirements. Images are stored locally in a static folder; the database stores image URLs.

- Backend: Python (FastAPI or Django REST Framework)
- Database: PostgreSQL
- Frontend: React.js (SPA)
- Hosting: Local/dev; production-ready concerns (CDN, SEO, analytics) are out of scope for MVP

## Scope and Information Architecture (IA)

- Public pages
  - Home: Breaking ticker (optional), Highlights, category blocks (Politics, Foreign, Gossip, Sports, Business, Entertainment)
  - Category listing: paginated list of articles per category
  - Article detail: title, summary, hero image, body, published time, category, tags
  - Search results: keyword search across article title/summary/body
  - About/Contact (static)

- Admin (single role: Admin)
  - Dashboard: quick stats (drafts, scheduled, published), latest edits
  - Articles: list, filter, create/edit/delete, publish/schedule
  - Categories & Tags: CRUD
  - Media Library: upload images (saved in static folder), view URLs, edit metadata (alt/caption/credit)
  - Homepage Curation: pin/ordering for Highlights and section overrides

- Languages: English only (no translation)
- No ads, no SEO, no analytics in MVP

## Categories and Sections

- Categories (hard-coded seed; editable via Admin)
  - Political News
  - Foreign News
  - Gossip Live
  - Sports Live
  - Business Live
  - Entertainment
  - Highlights (logical section powered by flag/curation, not a separate category)
- Global flags
  - breaking (bool)
  - featured (bool)
  - highlight (bool)
  - pinned (ordering handled via curation table)

## Roles and Permissions (MVP)

- Admin
  - Full access to all CRUD operations
  - Publish/Unpublish/Schedule
  - Curation, Media, Taxonomy, Settings
- No other roles needed in MVP

## Content Model and Database Schema (ERD Summary)

- articles
  - id (uuid PK)
  - status [draft|scheduled|published|archived]
  - title (text)
  - summary (text)
  - body_richtext (text)
  - slug (varchar unique)
  - primary_category_id (fk -> categories)
  - hero_image_url (varchar)
  - is_breaking (bool default false)
  - is_highlight (bool default false)
  - is_featured (bool default false)
  - published_at (timestamptz nullable)
  - embargo_at (timestamptz nullable)
  - unpublish_at (timestamptz nullable)
  - created_at, updated_at (timestamptz)

- categories
  - id (uuid PK)
  - name (varchar)
  - slug (varchar unique)
  - order_index (int)
  - is_active (bool default true)

- article_category (many-to-many for additional categories)
  - article_id (fk)
  - category_id (fk)
  - PRIMARY KEY (article_id, category_id)

- tags, article_tag
  - tags: id (uuid), name, slug unique
  - article_tag: article_id, tag_id (PK composite)

- media_assets
  - id (uuid PK)
  - type [image|file]
  - file_name (varchar)
  - url (varchar) — relative to static root (e.g., /static/uploads/2025/10/img.jpg)
  - width (int), height (int), mime_type (varchar)
  - alt_text (varchar), caption (varchar), credit (varchar)
  - created_at (timestamptz)

- homepage_sections
  - id (uuid PK)
  - key [hot_news|highlights|politics|foreign|gossip|sports|business|entertainment]
  - title (varchar)
  - layout_type (varchar) — e.g., grid, list, hero+list
  - config_json (jsonb)

- homepage_section_items
  - id (uuid PK)
  - section_id (fk)
  - article_id (fk)
  - order_index (int)
  - pin_start_at (timestamptz nullable)
  - pin_end_at (timestamptz nullable)

- users (MVP: single Admin)
  - id (uuid PK)
  - name, email (unique), password_hash
  - role (enum['admin'])
  - last_login_at, created_at, updated_at

- settings (optional for MVP)
  - key (varchar unique)
  - value_json (jsonb)

Notes:
- Use UUID primary keys and timestamptz in UTC.
- Add indexes: articles(status, published_at desc), articles(slug), tags(slug), categories(slug), FKs.

## Backend APIs (MVP)

- Auth (JWT)
  - POST /api/admin/auth/login -> {token}

- Articles (Admin)
  - GET /api/admin/articles?status=&q=&category=&tag=&page=
  - POST /api/admin/articles (create draft)
  - GET /api/admin/articles/:id
  - PUT /api/admin/articles/:id (edit)
  - POST /api/admin/articles/:id/publish
  - POST /api/admin/articles/:id/schedule (published_at)
  - POST /api/admin/articles/:id/unpublish
  - DELETE /api/admin/articles/:id

- Media (Admin)
  - POST /api/admin/media/upload (multipart) -> {url, id, meta}
  - GET /api/admin/media?type=&q=&page=

- Taxonomy (Admin)
  - CRUD /api/admin/categories
  - CRUD /api/admin/tags

- Curation (Admin)
  - GET /api/admin/homepage/sections
  - PUT /api/admin/homepage/sections/:key (update layout/config)
  - GET /api/admin/homepage/sections/:key/items
  - POST /api/admin/homepage/sections/:key/items (pin article, order/expiry)
  - DELETE /api/admin/homepage/sections/:key/items/:itemId

- Public APIs
  - GET /api/home (composed home payload: highlights + category blocks)
  - GET /api/articles?category=&tag=&q=&page=
  - GET /api/articles/:slug
  - GET /api/categories/:slug
  - GET /api/search?q=&page=

Payload notes:
- Article write payload: {title, summary, body_richtext, slug?, primary_category_id, additional_category_ids?, tag_ids?, hero_image_url?, flags, published_at?}
- Validation: slug unique; published_at >= now for scheduling; primary_category_id exists.

## Admin Panel (MVP)

- Dashboard: basic counts (draft/scheduled/published), recent articles.
- Article Editor:
  - Title, Summary, Rich text body
  - Primary category, additional categories, tags
  - Flags: Breaking, Highlight, Featured
  - Hero image picker (from Media Library)
  - Slug auto-generate + manual override
  - Save Draft, Publish Now, Schedule, Unpublish
- Media Library:
  - Upload single image, preview, copy URL, edit alt/caption/credit
- Categories & Tags: simple CRUD with ordering for categories
- Homepage Curation:
  - Manage Highlights list (pin/unpin and order)
  - Manage each category section order overrides (optional; otherwise latest published)

## Search (MVP)

- Backend: PostgreSQL full-text search on title, summary, body_richtext
- API: GET /api/search?q=&page= — returns paginated results by relevance then recency

## Performance and Caching (MVP)

- Simple in-memory cache in backend (or no cache for MVP)
- Paginated queries with indexes

## Security (MVP)

- JWT-based admin auth
- Password hashing (bcrypt/argon2)
- Basic input validation and HTML sanitization (allowlist) on body_richtext
- CORS restricted to frontend origin (configurable)

## Observability & Ops (MVP)

- Basic structured logging
- DB migrations (Alembic for FastAPI/SQLAlchemy or Django migrations)
- Local static folder for images: ./static/uploads/YYYY/MM/

## Acceptance Criteria (MVP)

- Admin can log in and perform CRUD on articles, categories, tags, and media
- Admin can publish now or schedule an article
- Homepage API returns Highlights and category blocks
- Category list and Article detail APIs work
- Search API returns relevant items for simple queries
- Images upload to static folder; article stores and renders hero_image_url

## Non-Functional (MVP Simplified)

- English-only
- Single Admin user
- No SEO, no ads, no analytics
- Works locally on Windows dev environment

## Suggested Tech Choices

- Backend: FastAPI + SQLAlchemy + Alembic + Pydantic + uvicorn
  - Alternative: Django + DRF
- Auth: PyJWT, passlib[bcrypt]
- DB: PostgreSQL (asyncpg or psycopg3)
- Frontend: React + Vite + React Router + Axios
- Rich text: TipTap or a simple Markdown editor with preview
- File upload: Starlette/FastAPI UploadFile -> save to ./static/uploads

## Future Enhancements (Post-MVP)

- Multi-language (si/ta), roles (Editor/Author), audit logs, revision history
- Better search (Meilisearch) and curated breaking ticker
- Image processing, thumbnails, and CDN
- Analytics dashboard and content insights
