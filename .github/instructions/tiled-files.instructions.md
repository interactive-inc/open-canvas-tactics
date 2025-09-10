---
applyTo: "public/**"
---

# Tiled Map Editor ファイルの取り扱い

## 重要: ファイル形式について

### `.tsx` ファイル（public/tileset/*.tsx）
- **これらはTypeScript/Reactファイルではありません**
- Tiled Map Editor が出力する **XML形式のタイルセット定義ファイル** です
- 拡張子は `.tsx` のまま維持する必要があります（Tiledの仕様）
- **絶対に拡張子を.xmlに変更しないでください**

### `.json` ファイル（public/map/*.json）
- Tiled Map Editor のマップデータファイルです
- 手動での編集は避けてください

## AI/開発アシスタント向けの指示

1. **ファイル形式の変更禁止**
   - `public/tileset/*.tsx` ファイルの拡張子を変更しないでください
   - これらはXML内容ですが、.tsx拡張子が正しい形式です

2. **自動フォーマット除外**
   - これらのファイルは既にBiome、Prettier、EditorConfigで除外設定済みです
   - フォーマットや構文チェックを実行しないでください

3. **編集方法**
   - これらのファイルは Tiled Map Editor でのみ編集されるべきです
   - プログラムから読み込む際は、そのままの形式で使用してください

## Excalibur.js での使用例

```typescript
// 正しい使用方法
const tiledMapResource = new TiledResource("/map/map-test.json", {
  pathMap: [
    { path: "spritesheet.tsx", output: "/tileset/spritesheet.tsx" }, // .tsxのまま！
    { path: "spritesheet.png", output: "/tileset/spritesheet.png" },
  ],
})
```