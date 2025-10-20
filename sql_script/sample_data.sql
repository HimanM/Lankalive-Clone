-- sample_data.sql
-- Inserts sample data for local testing of the Lankalive-like MVP

-- IMPORTANT: this script is intended to run against the 'lankalive' database.
-- If the database does not yet exist, create it first (run as a superuser):
--   CREATE DATABASE lankalive;
-- Then run this file with psql and ensure you are connected to 'lankalive':
--   \connect lankalive
-- When running non-interactively you can also run:
--   psql -d lankalive -f sql_script/sample_data.sql


-- Categories
INSERT INTO categories (id, name, slug, order_index, is_active) VALUES
  (uuid_generate_v4(), 'Political News', 'political-news', 1, true),
  (uuid_generate_v4(), 'Foreign News', 'foreign-news', 2, true),
  (uuid_generate_v4(), 'Gossip Live', 'gossip-live', 3, true),
  (uuid_generate_v4(), 'Sports Live', 'sports-live', 4, true),
  (uuid_generate_v4(), 'Business Live', 'business-live', 5, true),
  (uuid_generate_v4(), 'Entertainment', 'entertainment', 6, true);

-- Tags
INSERT INTO tags (id, name, slug) VALUES
  (uuid_generate_v4(), 'breaking', 'breaking'),
  (uuid_generate_v4(), 'exclusive', 'exclusive'),
  (uuid_generate_v4(), 'opinion', 'opinion');

-- Media (use placeholder paths — ensure these files exist in ./static/uploads/... for front-end rendering)
INSERT INTO media_assets (id, type, file_name, url, width, height, mime_type, alt_text, caption, credit)
VALUES
  (uuid_generate_v4(), 'image', 'hero1.jpg', '/static/uploads/2025/10/hero1.jpg', 1200, 800, 'image/jpeg', 'Hero image 1', 'Caption for hero 1', 'Photographer A'),
  (uuid_generate_v4(), 'image', 'thumb1.jpg', '/static/uploads/2025/10/thumb1.jpg', 400, 300, 'image/jpeg', 'Thumb 1', 'Thumb caption', 'Photographer B');

-- Admin user (password hash placeholder — replace with actual bcrypt hash before use)
INSERT INTO users (id, name, email, password_hash, role)
VALUES (uuid_generate_v4(), 'Admin', 'admin@example.com', 'REPLACE_WITH_BCRYPT_HASH', 'admin');

-- Example articles
INSERT INTO articles (id, status, title, summary, body_richtext, slug, primary_category_id, hero_image_url, is_breaking, is_highlight, is_featured, published_at)
VALUES
  (uuid_generate_v4(), 'published', 'Sample breaking story', 'Summary of the breaking story', '<p>This is the body of the breaking story. Test content.</p>', 'sample-breaking-story', (SELECT id FROM categories WHERE slug='political-news' LIMIT 1), '/static/uploads/2025/10/hero1.jpg', true, true, false, now()),
  (uuid_generate_v4(), 'published', 'Local sports result', 'Summary of sports result', '<p>Team A defeated Team B in a dramatic finish.</p>', 'local-sports-result', (SELECT id FROM categories WHERE slug='sports-live' LIMIT 1), '/static/uploads/2025/10/thumb1.jpg', false, false, false, now() - interval '1 day');

-- Associate tags with articles
INSERT INTO article_tag (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t WHERE a.slug='sample-breaking-story' AND t.slug='breaking';

-- Homepage sections
INSERT INTO homepage_sections (id, key, title, layout_type, config_json)
VALUES
  (uuid_generate_v4(), 'highlights', 'Highlights', 'hero-list', '{"limit": 6}'),
  (uuid_generate_v4(), 'hot_news', 'Hot News', 'list', '{"limit": 10}');

-- Pin articles into highlights
INSERT INTO homepage_section_items (id, section_id, article_id, order_index)
SELECT uuid_generate_v4(), hs.id, a.id, 1
FROM homepage_sections hs, articles a
WHERE hs.key='highlights' AND a.slug='sample-breaking-story';
