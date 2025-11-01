# 🚀 クイックスタートガイド

## 5分で始める Shift Japan Insight

### ステップ 1: 依存関係のインストール

```bash
npm install
```

### ステップ 2: Supabaseプロジェクトの作成

1. [https://supabase.com](https://supabase.com) でアカウント作成（無料）
2. 「New Project」をクリック
3. プロジェクト情報を入力
4. データベースパスワードを設定
5. 「Create new project」をクリック

### ステップ 3: データベースのセットアップ

1. Supabaseダッシュボードで「SQL Editor」を開く
2. 「New query」をクリック
3. `supabase/schema.sql` の全内容をコピー＆ペースト
4. 「Run」をクリックして実行
5. ✅ 成功メッセージを確認

### ステップ 4: 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成：

**Windows:**
```bash
New-Item -Path .env.local -ItemType File
```

**macOS/Linux:**
```bash
touch .env.local
```

Supabaseダッシュボードから値を取得：

1. 「Settings」→「API」を開く
2. **Project URL** をコピー
3. **anon public** キーをコピー

`.env.local` に以下を記入：
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### ステップ 5: 開発サーバー起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く

### ステップ 6: サンプルレポートの確認

以下のURLを開いて動作確認：
```
http://localhost:3000/report/sample-japan-relocation-guide
```

✅ すべて表示されれば成功です！

## トラブルシューティング

### 環境変数エラー
- `.env.local` ファイルが正しい場所にあるか確認
- 値にコピペミスがないか確認
- サーバーを再起動: `Ctrl+C` → `npm run dev`

### データベースエラー
- Supabase SQL Editorで `schema.sql` が実行されたか確認
- Table Editorで `insight_posts` テーブルが存在するか確認

### ページが表示されない
- ブラウザのコンソール（F12）でエラーを確認
- `npm install` を再実行

## 次のステップ

- 📖 [README.md](./README.md) - 詳細ドキュメント
- 🔧 [SETUP.md](./SETUP.md) - 詳細セットアップ手順
- 🚀 [DEPLOYMENT.md](./DEPLOYMENT.md) - デプロイ方法
- 📊 [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - プロジェクト概要

## ヘルプが必要？

問題が解決しない場合は、エラーメッセージと一緒にIssueを作成してください。
