-- Create blog_ja table (Japanese)
CREATE TABLE IF NOT EXISTS blog_ja (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  main_image TEXT,
  content_blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  categories TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  sources JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_en table (English)
CREATE TABLE IF NOT EXISTS blog_en (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  main_image TEXT,
  content_blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  categories TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  sources JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_ko table (Korean)
CREATE TABLE IF NOT EXISTS blog_ko (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  main_image TEXT,
  content_blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  categories TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  sources JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_blog_ja_slug ON blog_ja(slug);
CREATE INDEX IF NOT EXISTS idx_blog_ja_categories ON blog_ja USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_blog_ja_tags ON blog_ja USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_blog_ja_created_at ON blog_ja(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_blog_en_slug ON blog_en(slug);
CREATE INDEX IF NOT EXISTS idx_blog_en_categories ON blog_en USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_blog_en_tags ON blog_en USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_blog_en_created_at ON blog_en(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_blog_ko_slug ON blog_ko(slug);
CREATE INDEX IF NOT EXISTS idx_blog_ko_categories ON blog_ko USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_blog_ko_tags ON blog_ko USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_blog_ko_created_at ON blog_ko(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
CREATE TRIGGER update_blog_ja_updated_at BEFORE UPDATE ON blog_ja
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_en_updated_at BEFORE UPDATE ON blog_en
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_ko_updated_at BEFORE UPDATE ON blog_ko
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE blog_ja ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_en ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_ko ENABLE ROW LEVEL SECURITY;

-- Create policies (allow public read access)
CREATE POLICY "Public read access" ON blog_ja
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON blog_en
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON blog_ko
  FOR SELECT USING (true);

-- Allow INSERT operations (for admin)
CREATE POLICY "Allow insert" ON blog_ja
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow insert" ON blog_en
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow insert" ON blog_ko
  FOR INSERT WITH CHECK (true);

-- Allow UPDATE operations (for admin)
CREATE POLICY "Allow update" ON blog_ja
  FOR UPDATE USING (true);

CREATE POLICY "Allow update" ON blog_en
  FOR UPDATE USING (true);

CREATE POLICY "Allow update" ON blog_ko
  FOR UPDATE USING (true);

-- Allow DELETE operations (for admin)
CREATE POLICY "Allow delete" ON blog_ja
  FOR DELETE USING (true);

CREATE POLICY "Allow delete" ON blog_en
  FOR DELETE USING (true);

CREATE POLICY "Allow delete" ON blog_ko
  FOR DELETE USING (true);

-- Add comments for documentation
COMMENT ON TABLE blog_ja IS 'Japanese language blog posts table';
COMMENT ON TABLE blog_en IS 'English language blog posts table';
COMMENT ON TABLE blog_ko IS 'Korean language blog posts table';

COMMENT ON COLUMN blog_ja.content_blocks IS 'JSONB format structured content blocks array';
COMMENT ON COLUMN blog_ja.categories IS 'Category classification array';
COMMENT ON COLUMN blog_ja.tags IS 'SEO tags array';
COMMENT ON COLUMN blog_ja.sources IS 'Reference sources JSON array';
