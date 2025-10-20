-- Seed categories for Lanka Live
-- Run this after creating the database schema

-- Insert categories
INSERT INTO categories (id, name, slug, order_index, is_active) VALUES
  (gen_random_uuid(), 'Political News', 'political-news', 1, true),
  (gen_random_uuid(), 'Foreign News', 'foreign-news', 2, true),
  (gen_random_uuid(), 'Local News', 'local-news', 3, true),
  (gen_random_uuid(), 'Sports Live', 'sports-live', 4, true),
  (gen_random_uuid(), 'Business Live', 'business-live', 5, true),
  (gen_random_uuid(), 'Entertainment', 'entertainment', 6, true),
  (gen_random_uuid(), 'Gossip Live', 'gossip-live', 7, true)
ON CONFLICT (slug) DO NOTHING;

-- Check if categories were inserted
SELECT * FROM categories ORDER BY order_index;
