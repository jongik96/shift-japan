# 🚀 Shift Japan Insight セットアップガイド

## 必要なもの

- Node.js 18 以上
- npm または yarn
- Supabase アカウント（無料プランでOK）

## インストール手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Supabase プロジェクトの作成

1. [https://supabase.com](https://supabase.com) にアクセス
2. アカウント作成（無料）
3. 「New Project」をクリック
4. プロジェクト名を入力（例: shift-japan-insight）
5. データベースパスワードを設定
6. リージョンを選択（日本は Tokyo が最適）
7. 「Create new project」をクリック
8. プロジェクトが準備されるまで待機（1-2分）

### 3. Supabase データベースのセットアップ

1. プロジェクトダッシュボードで「SQL Editor」を開く
2. 「New query」をクリック
3. `supabase/schema.sql` の内容をコピー＆ペースト
4. 「Run」をクリックして実行
5. 「Success. No rows returned」と表示されればOK

### 4. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成：

```bash
# Windows (Git Bash)
touch .env.local

# macOS / Linux
touch .env.local
```

Supabase ダッシュボードから環境変数を取得：

1. 「Settings」→「API」を開く
2. 以下をコピー：
   - Project URL
   - anon/public key

`.env.local` に以下のように記入：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて動作確認

## サンプルデータの確認

Supabase のテーブルエディターで確認：

1. ダッシュボードの「Table Editor」を開く
2. 「insight_posts」テーブルを選択
3. サンプルレポートが1件表示されることを確認

ブラウザで以下のURLを開いてテスト：

- [http://localhost:3000/report/sample-japan-relocation-guide](http://localhost:3000/report/sample-japan-relocation-guide)

## トラブルシューティング

### Supabase 接続エラー

- `.env.local` の環境変数が正しいか確認
- サーバーを再起動: `Ctrl+C` で停止し、再度 `npm run dev`

### データベースエラー

- Supabase SQL Editor で `schema.sql` が正しく実行されたか確認
- Table Editor で `insight_posts` テーブルが存在するか確認

### チャートが表示されない

- ブラウザのコンソールでエラーを確認
- `package.json` の `recharts` がインストールされているか確認

## 次のステップ

- [README.md](./README.md) を参照してコンテンツの追加方法を確認
- 独自のレポートを Supabase に追加
- Vercel にデプロイして本番環境を構築

## よくある質問

**Q: Supabase の無料プランで運用できますか？**  
A: はい。無料プランで数万件のレコードまで対応可能です。

**Q: 本番環境のデプロイは？**  
A: [README.md](./README.md) の「デプロイ」セクションを参照してください。

**Q: 独自ドメインは使えますか？**  
A: Vercel では独自ドメインの設定が可能です。
