-- init_schema.sql
-- Creates extensions and tables for the Lankalive-like MVP

-- require uuid extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

-- tags
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE
);

-- media assets
CREATE TABLE IF NOT EXISTS media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL,
  file_name VARCHAR(1024) NOT NULL,
  url VARCHAR(2048) NOT NULL,
  width INTEGER,
  height INTEGER,
  mime_type VARCHAR(100),
  alt_text VARCHAR(1024),
  caption TEXT,
  credit VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- users (MVP: single admin)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(320) NOT NULL UNIQUE,
  password_hash VARCHAR(1024) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- articles
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  status VARCHAR(32) NOT NULL DEFAULT 'draft',
  title VARCHAR(1024) NOT NULL,
  summary TEXT,
  body_richtext TEXT,
  slug VARCHAR(1024) UNIQUE,
  primary_category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  hero_image_url VARCHAR(2048),
  is_breaking BOOLEAN DEFAULT FALSE,
  is_highlight BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  embargo_at TIMESTAMP WITH TIME ZONE,
  unpublish_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- association tables
CREATE TABLE IF NOT EXISTS article_category (
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, category_id)
);

CREATE TABLE IF NOT EXISTS article_tag (
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- homepage sections and items (for curation)
CREATE TABLE IF NOT EXISTS homepage_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(255),
  layout_type VARCHAR(100),
  config_json JSONB
);

CREATE TABLE IF NOT EXISTS homepage_section_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID REFERENCES homepage_sections(id) ON DELETE CASCADE,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  pin_start_at TIMESTAMP WITH TIME ZONE,
  pin_end_at TIMESTAMP WITH TIME ZONE
);
