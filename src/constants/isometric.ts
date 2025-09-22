// アイソメトリックマップの定数
export const ISOMETRIC = {
  // タイルのサイズ
  TILE_WIDTH: 32,
  TILE_HEIGHT: 16,

  // 1グリッド移動時のピクセル数
  GRID_MOVE_X: 16, // 右方向への移動
  GRID_MOVE_Y: 8, // 下方向への移動（アイソメトリックなのでYは半分）

  // 初期位置の計算用
  MAP_GRID_X: 80,
  MAP_GRID_Y: 160,
  OFFSET_X: -32,
  OFFSET_Y: -62 + 12,
} as const

// 初期位置を計算する関数
export function getInitialPosition() {
  const screenX =
    -(ISOMETRIC.MAP_GRID_X - ISOMETRIC.MAP_GRID_Y) + ISOMETRIC.OFFSET_X
  const screenY =
    ISOMETRIC.MAP_GRID_X + ISOMETRIC.MAP_GRID_Y + ISOMETRIC.OFFSET_Y
  return { x: screenX, y: screenY }
}
