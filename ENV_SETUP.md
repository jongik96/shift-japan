# 🔐 環境変数の設定方法

プロジェクトルート（`shift-japan`フォルダ）に `.env.local` ファイルを作成してください。

## Windowsの場合

プロジェクトフォルダで以下のコマンドを実行：

```bash
# PowerShell
New-Item -Path .env.local -ItemType File

# Git Bash
touch .env.local
```

## macOS / Linuxの場合

```bash
touch .env.local
```

## ファイル内容

`.env.local` ファイルに以下を貼り付けて、実際の値を記入してください：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Supabaseの値の取得方法

1. [https://supabase.com](https://supabase.com) にログイン
2. プロジェクトを選択（まだの場合は作成）
3. 左側メニューから「Settings」→「API」をクリック
4. 以下の2つの値をコピー：
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL` に設定
   - **anon public** キー → `NEXT_PUBLIC_SUPABASE_ANON_KEY` に設定

## 注意事項

⚠️ `.env.local` ファイルは Git にコミットされません（.gitignoreで除外されています）

⚠️ `.env.local` ファイルを編集後は、開発サーバーを再起動してください：

```bash
# Ctrl+C でサーバーを停止
# その後、再度起動
npm run dev
```
