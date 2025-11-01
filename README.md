# 🇯🇵 Shift Japan Insight

日本転職・移住の専門分析レポートを提供するプラットフォーム

## 概要

Shift Japan Insight は、日本への移住、転職、キャリアに関する深い洞察とデータ分析を提供する専門ブログプラットフォームです。500以上の構造化されたレポートを管理し、インタラクティブな要素とSEO最適化を実現します。

## 主な機能

### 📊 構造化されたコンテンツ
- **Content Blocks**: レポートを構造化されたブロック形式で管理
  - Heading (H2) - 目次自動生成
  - Paragraph - テキストコンテンツ
  - Interactive Charts - D3.jsベースの可視化
  - Comparison Tables - 比較データ表
  - Pull Quotes - 重要な洞察の強調
  - Definition Boxes - 専門用語の説明

### 🎨 UI/UX特徴
- **Sticky TOC**: デスクトップで左側に固定される目次
- **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応
- **Share Bar**: 右側に固定されるSNS共有機能
- **引用機能**: テキスト選択時の自動引用コピー
- **専門的なレイアウト**: 750px幅の読みやすいコンテンツ

### 🗄️ Supabaseデータベース
```sql
insight_posts
├── slug (URL用一意識別子)
├── title (レポートタイトル)
├── excerpt (メタ説明)
├── main_image (代表画像)
├── content_blocks (JSONB - 構造化コンテンツ)
├── categories (配列 - カテゴリー)
├── tags (配列 - タグ)
└── sources (JSONB - 参照元)
```

### 🔍 SEO最適化
- メタタグ自動生成
- OpenGraph対応
- 構造化データ（将来的に実装）
- カテゴリー・タグベースのフィルタリング
- 内部リンク最適化

## 技術スタック

- **フロントエンド**: Next.js 14, React 18, TypeScript
- **スタイリング**: Tailwind CSS
- **データベース**: Supabase (PostgreSQL)
- **チャート**: Recharts
- **デプロイ**: Vercel推奨

## セットアップ

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd shift-japan
```

### 2. 依存関係のインストール
```bash
npm install
# または
yarn install
```

### 3. 環境変数の設定
`.env.local`ファイルを作成し、以下を設定：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Supabaseデータベースのセットアップ

1. [Supabase](https://supabase.com)でプロジェクトを作成
2. SQL Editorで `supabase/schema.sql` を実行
3. URLとAnon Keyを環境変数に設定

### 5. 開発サーバーの起動
```bash
npm run dev
# または
yarn dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## プロジェクト構造

```
shift-japan/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # ルートレイアウト
│   ├── page.tsx             # ホームページ
│   ├── globals.css          # グローバルスタイル
│   ├── reports/             # レポート一覧
│   │   └── page.tsx
│   └── report/              # レポート詳細（動的ルート）
│       └── [slug]/
│           └── page.tsx
├── components/               # Reactコンポーネント
│   ├── Header.tsx           # ヘッダー
│   ├── Footer.tsx           # フッター
│   ├── ContentRenderer.tsx  # コンテンツブロックレンダラー
│   ├── TOC.tsx              # 目次コンポーネント
│   └── ShareBar.tsx         # 共有バー
├── lib/                      # ユーティリティ
│   ├── supabase.ts          # Supabaseクライアント
│   └── types.ts             # TypeScript型定義
├── supabase/                # データベーススキーマ
│   └── schema.sql
└── public/                   # 静的ファイル
```

## コンテンツ作成の流れ

### サンプルレポートの追加
```sql
INSERT INTO insight_posts (
  slug, title, excerpt, main_image, 
  content_blocks, categories, tags, sources
) VALUES (
  'your-slug',
  'レポートタイトル',
  '要約文',
  '画像URL',
  '[...content_blocks...]'::jsonb,
  ARRAY['カテゴリー1', 'カテゴリー2'],
  ARRAY['タグ1', 'タグ2'],
  '[{"title": "参照元", "url": "URL"}]'::jsonb
);
```

### Content Blocks JSONスキーマ
```json
[
  {
    "type": "heading_h2",
    "content": { "text": "セクションタイトル" }
  },
  {
    "type": "paragraph",
    "content": { "text": "テキストコンテンツ" }
  },
  {
    "type": "comparison_table",
    "content": {
      "headers": ["列1", "列2"],
      "rows": [["値1", "値2"]]
    }
  },
  {
    "type": "interactive_chart",
    "content": {
      "chart_type": "bar",
      "title": "チャートタイトル",
      "x_key": "x軸キー",
      "y_key": "y軸キー",
      "data": [{"key": "value"}]
    }
  },
  {
    "type": "pull_quote",
    "content": {
      "text": "引用テキスト",
      "author": "著者（任意）"
    }
  },
  {
    "type": "definition_box",
    "content": {
      "term": "用語",
      "definition": "定義文",
      "related_terms": ["関連用語"]
    }
  }
]
```

## デプロイ

### Vercel推奨
```bash
npm install -g vercel
vercel
```

環境変数をVercelプロジェクト設定で追加してください。

## 今後の実装予定

- [ ] OpenAI API統合（コンテンツ自動生成）
- [ ] ニュースレター機能
- [ ] 管理者ダッシュボード
- [ ] 検索機能
- [ ] コメント機能
- [ ] 構造化データ（JSON-LD）
- [ ] 多言語対応

## ライセンス

MIT

## お問い合わせ

プロジェクトに関する質問や提案は Issue でお願いします。
