# 🚀 デプロイガイド

## Vercel へのデプロイ（推奨）

### 1. GitHubにプッシュ

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Vercelに接続

1. [https://vercel.com](https://vercel.com) にアクセス
2. 「Sign Up」またはログイン
3. 「Add New...」→「Project」をクリック
4. GitHubリポジトリを選択
5. 「Import」をクリック

### 3. 環境変数の設定

Vercelプロジェクト設定画面で：

1. 「Environment Variables」セクションを開く
2. 以下を追加：

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | your-supabase-url |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your-supabase-anon-key |

3. 「Deploy」をクリック

### 4. 自動デプロイ

- `main` ブランチへのプッシュが自動でデプロイされます
- プレビューデプロイも自動で作成されます

## Netlify へのデプロイ（代替案）

### 1. 設定ファイルの作成

プロジェクトルートに `netlify.toml` を作成：

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"
```

### 2. Netlifyにデプロイ

1. [https://netlify.com](https://netlify.com) にアクセス
2. 「Add new site」→「Import an existing project」
3. GitHubリポジトリを接続
4. 環境変数を設定（Vercelと同様）
5. 「Deploy site」をクリック

## Supabase RLS (Row Level Security) の設定

本番環境では、RLSポリシーが正しく設定されているか確認してください。

Supabase SQL Editorで実行：

```sql
-- insight_posts テーブルのRLS確認
SELECT * FROM pg_policies WHERE tablename = 'insight_posts';

-- 必要に応じてポリシーを追加
CREATE POLICY "Public read access" ON insight_posts
  FOR SELECT USING (true);
```

## カスタムドメインの設定

### Vercel

1. 「Settings」→「Domains」を開く
2. カスタムドメインを追加
3. DNS設定を案内に従って設定

### SSL証明書

両プラットフォームで自動的にSSL証明書が発行されます。

## パフォーマンス最適化

### 1. 画像最適化

`next.config.js` に追加：

```javascript
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}
```

### 2. 静的生成

将来的に必要なページを静的生成：

```typescript
export const revalidate = 3600 // ISR: 1時間ごと
```

### 3. CDN設定

Vercel/Netlifyは自動でCDNを提供します。

## 監視とアナリティクス

### Vercel Analytics

1. 「Settings」→「Analytics」を有効化
2. トラフィック監視開始

### Supabaseダッシュボード

1. 「Reports」でデータベース使用状況を確認
2. 「Logs」でエラーを監視

## バックアップ

### Supabase

1. 「Settings」→「Database」→「Backups」
2. 自動バックアップが有効
3. 手動バックアップも可能

### コード

GitHubリポジトリに定期的にプッシュしてください。
