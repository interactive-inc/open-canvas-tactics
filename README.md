# Excalibur.js React SRPG Base

Vite + React + TypeScript + Redux Toolkit + Excalibur.js を使用したSRPGベースプロジェクト

## 技術スタック

- **React 19** - UIライブラリ
- **TypeScript** - 型安全な開発
- **Vite** - 高速ビルドツール
- **Redux Toolkit** - 状態管理
- **TailwindCSS** - スタイリング
- **Excalibur.js** - ゲームエンジン
- **Biome** - リンティング・フォーマッティング

## セットアップ手順

1. 依存関係のインストール:
```bash
bun install
```

2. 開発サーバー起動:
```bash
bun run dev
```

3. ブラウザで http://localhost:5173 にアクセス

## 利用可能なスクリプト

- `bun run dev` - 開発サーバー起動
- `bun run build` - プロダクションビルド
- `bun run serve` - ビルド済みアプリのプレビュー
- `bun run test` - テスト実行
- `bun run lint` - コードのリンティング
- `bun run format` - コードのフォーマット
- `bun run typecheck` - 型チェック

## ディレクトリ構成

```
src/
├── features/       # Redux Toolkitのスライス
├── services/       # RTK Query API定義
├── components/     # Reactコンポーネント
│   ├── game/      # ゲーム関連
│   └── ui/        # UI部品
├── types/         # 型定義
├── utils/         # ユーティリティ
└── constants/     # 定数
```

## 実行コマンド一覧

```bash
# プロジェクトセットアップ
bun install

# 開発開始
bun run dev

# コード品質チェック
bun run lint
bun run typecheck
bun run format

# ビルド
bun run build
```