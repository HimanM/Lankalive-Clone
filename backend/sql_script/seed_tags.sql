-- Seed tags for testing
-- Run: psql -h localhost -p 5432 -U postgres -d lankalive -f seed_tags.sql

INSERT INTO tags (id, name, slug) VALUES 
  (gen_random_uuid(), 'Breaking', 'breaking'),
  (gen_random_uuid(), 'Trending', 'trending'),
  (gen_random_uuid(), 'Analysis', 'analysis'),
  (gen_random_uuid(), 'Opinion', 'opinion'),
  (gen_random_uuid(), 'Exclusive', 'exclusive'),
  (gen_random_uuid(), 'Investigation', 'investigation'),
  (gen_random_uuid(), 'Feature', 'feature'),
  (gen_random_uuid(), 'Interview', 'interview'),
  (gen_random_uuid(), 'Video', 'video'),
  (gen_random_uuid(), 'Photo Gallery', 'photo-gallery')
ON CONFLICT (slug) DO NOTHING;
