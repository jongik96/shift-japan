-- Create insight_posts table
CREATE TABLE IF NOT EXISTS insight_posts (
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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_insight_posts_slug ON insight_posts(slug);
CREATE INDEX IF NOT EXISTS idx_insight_posts_categories ON insight_posts USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_insight_posts_tags ON insight_posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_insight_posts_created_at ON insight_posts(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_insight_posts_updated_at BEFORE UPDATE ON insight_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE insight_posts ENABLE ROW LEVEL SECURITY;

-- Create policies (allow public read access)
CREATE POLICY "Public read access" ON insight_posts
  FOR SELECT USING (true);

-- Insert sample data for testing
INSERT INTO insight_posts (slug, title, excerpt, main_image, content_blocks, categories, tags, sources) VALUES
(
  'sample-japan-relocation-guide',
  '日本移住完全ガイド2024：ビザから生活まで徹底解説',
  '日本への移住を検討している方向けに、ビザ取得、住居探し、医療制度、教育環境まで、実体験とデータに基づく包括的なガイドをお届けします。',
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
  '[
    {
      "type": "heading_h2",
      "content": {
        "text": "日本移住の基本概要"
      }
    },
    {
      "type": "paragraph",
      "content": {
        "text": "日本への移住は、安定した経済環境、豊かな文化、高度な医療制度など多くの魅力があります。本レポートでは、実際の移住プロセスをデータと事例を通じて詳しく解説します。"
      }
    },
    {
      "type": "definition_box",
      "content": {
        "term": "高度人材ポイント制",
        "definition": "日本の高度人材向けビザ制度。学歴、職歴、年収などでポイントを計算し、70点以上で優遇措置を受けることができます。特に就労・永住要件が緩和されることで、多くの外国人が活用しています。",
        "related_terms": ["就労ビザ", "永住権", "高度専門職"]
      }
    },
    {
      "type": "heading_h2",
      "content": {
        "text": "ビザの種類と取得条件"
      }
    },
    {
      "type": "comparison_table",
      "content": {
        "headers": ["ビザ種類", "在留期間", "就労可否", "家族帯同"],
        "rows": [
          ["就労ビザ", "3ヶ月〜5年", "✅ 限定", "✅ 可能"],
          ["高度人材ビザ", "5年", "✅ 無制限", "✅ 可能"],
          ["特定技能ビザ", "1年〜5年", "✅ 限定", "△ 条件により"],
          ["留学ビザ", "3ヶ月〜4年", "△ 週28時間以内", "❌ 不可"]
        ]
      }
    },
    {
      "type": "pull_quote",
      "content": {
        "text": "2023年の統計によると、高度人材ポイント制を利用した移住者は前年比25%増加。特にIT・エンジニア領域での活用が顕著です。",
        "author": "出入国在留管理庁データ2023年"
      }
    },
    {
      "type": "heading_h2",
      "content": {
        "text": "都市別生活コスト比較"
      }
    },
    {
      "type": "interactive_chart",
      "content": {
        "chart_type": "bar",
        "title": "月間生活費比較（単身者、円換算）",
        "x_key": "city",
        "y_key": "cost",
        "data": [
          {"city": "東京", "cost": 250000},
          {"city": "大阪", "cost": 180000},
          {"city": "福岡", "cost": 150000},
          {"city": "名古屋", "cost": 170000}
        ]
      }
    }
  ]'::jsonb,
  ARRAY['移住・生活', 'データ分析'],
  ARRAY['日本移住', 'ビザ', '高度人材', '転職', 'エンジニア'],
  '[
    {"title": "出入国在留管理庁", "url": "https://www.moj.go.jp/isa/"},
    {"title": "外務省", "url": "https://www.mofa.go.jp/"}
  ]'::jsonb
);

-- Add comments for documentation
COMMENT ON TABLE insight_posts IS '専門分析レポートを格納するテーブル。コンテンツは構造化されたブロック形式で保存。';
COMMENT ON COLUMN insight_posts.content_blocks IS 'JSONB形式で保存される構造化コンテンツブロックの配列';
COMMENT ON COLUMN insight_posts.categories IS 'カテゴリー分類用の配列';
COMMENT ON COLUMN insight_posts.tags IS 'SEO用のタグ配列';
COMMENT ON COLUMN insight_posts.sources IS '参照元情報のJSON配列';
