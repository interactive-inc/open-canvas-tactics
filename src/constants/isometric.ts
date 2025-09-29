// アイソメトリックマップの定数
export const ISOMETRIC = {
  // タイルのサイズ
  TILE_WIDTH: 32,
  TILE_HEIGHT: 16,

  // 1グリッド移動時のピクセル数
  GRID_MOVE_X: 16, // 右方向への移動
  GRID_MOVE_Y: 8, // 下方向への移動（アイソメトリックなのでYは半分）
} as const
