# Excalibur.js + React SRPG ベース

Excalibur.js（ゲームエンジン）とReact（UI）を組み合わせたSRPGゲームのベーステンプレートです。

ゲームエンジンにExcalibur.js、UIフレームワークにReact 19を使用。ルーティングはTanStack Router、状態管理はRedux Toolkit、UIコンポーネントはshadcn/ui、スタイリングはTailwind CSS v4で構築。ビルドツールはVite、パッケージ管理はBun、コード整形にBiomeを採用しています。

## 🎮 デモ

移動ボタンを押すとアイソメトリックマップ上でキャラクターが移動します。

## 🚀 セットアップ

```bash
# 依存関係のインストール
bun install

# 開発サーバーの起動
bun dev

# ビルド
bun build
```

ブラウザで http://localhost:5173 にアクセス

## 📁 プロジェクト構成

```
src/
├── actors/          # Excalibur.jsのActorクラス（ユニット、タイル等）
├── components/
│   ├── scenes/      # シーンごとのUIコンポーネント
│   └── ui/          # shadcn/ui 汎用UIコンポーネント
├── constants/       # ゲーム定数（グリッド計算等）
├── contexts/        # React Context（ゲームエンジンへのアクセス）
├── features/        # Redux Toolkit（ゲーム状態管理）
├── routes/          # TanStack Routerのページ
├── scenes/          # Excalibur.jsのSceneクラス（ゲームロジック）
└── sprite-sheets/   # スプライトシート定義

public/
├── tileset/        # Tiledタイルセット（*.tsxはXML形式）
├── map/            # Tiledマップデータ
└── character/      # キャラクター画像
```

## 🏗️ アーキテクチャ設計

### アーキテクチャ

Excalibur.jsのレンダリング層とReactのUI層を明確に分離した設計になっています。ゲームロジックはすべて`Scene`クラスに集約し、Reactコンポーネントは対応するSceneのメソッドを呼び出すだけの役割を持ちます。

```typescript
// src/scenes/main.ts - ゲームロジック
export class MainScene extends Scene {
  moveUnitToRight(): Promise<void> {
    return this.moveUnitByGrid(1, 1)
  }
}

// src/components/scenes/main-scene-component.tsx - UI
export function MainSceneComponent(props: { scene: MainScene }) {
  const onMove = () => props.scene.moveUnitToRight()
  return <Button onClick={onMove}>移動</Button>
}

// src/routes/index.tsx - シーン切り替え
const scene = gameEngine.currentScene
if (scene instanceof MainScene) {
  return <MainSceneComponent scene={scene} />
}
```

`EngineContext`を通じてReactコンポーネントからゲームエンジンにアクセスし、`instanceof`による型チェックで現在のシーンを判定してUIを切り替えます。

## 🎯 アイソメトリックグリッドシステム

`src/constants/isometric.ts`でグリッド移動の定数を管理しています。1グリッドあたりX方向に16ピクセル、Y方向に8ピクセル（アイソメトリック投影のため半分）移動します。

## 📝 開発時の注意

`public/tileset/*.tsx`ファイルはTypeScriptではなくTiled Map EditorのXML形式タイルセット定義です。拡張子は変更せず、編集はTiled Map Editorで行ってください。

ゲームロジックは必ず`Scene`クラスに実装し、ReactコンポーネントはSceneのメソッドを呼び出すだけにとどめます。Actorの直接操作は避け、すべてのエンジン操作は`EngineContext`経由で行います。

## 📄 ライセンス

MIT

## 🤝 コントリビューション

Issue・PRお待ちしています！
