/**
 * アイソメトリックマップにおけるグリッド座標とスクリーン座標の変換ユーティリティ
 * - グリッド座標 (X, Y): アイソメトリックマップ上の論理的な位置を表す座標
 * - スクリーン座標 (x, y): 実際の画面上のピクセル位置を表す座標
 * - 変換式:
 *  - x = 16 * X + (X * 0.25)
 *   - y = screenOriginY + (8 * Y) + (Y * 0.25)
 * - screenOriginY はマップの基準点Y座標で、デフォルトは168
 */

export type GridPosition = {
  gridX: number // グリッドX座標
  gridY: number // グリッドY座標
}

export type ScreenPosition = {
  x: number // スクリーンX座標（ピクセル）
  y: number // スクリーンY座標（ピクセル）
}

// グリッド座標をスクリーン座標に変換する関数
export function toIsometricPosition(
  X: number,
  Y: number,
  screenOriginY?: number,
  screenOffsetY?: number,
): ScreenPosition {
  const { gridX, gridY } = diagonalToGrid(X, Y)

  // X軸: 一律16ずつ変化、微調整で+0.25*マス目
  const screenX = 16 * gridX + gridX * 0.25 // 16*マス目 + 微調整(0.25*マス目)

  // Y軸: 基準点(168) + 8ずつ変化、微調整で+0.25*マス目
  const originY = screenOriginY ?? 168 // mapSampleのscreenOriginY = 168をデフォルトにする
  const offsetY = screenOffsetY ?? 32
  const screenY = originY + 8 * gridY + gridY * 0.25 + offsetY // 168を基準点に+ 8*-2~+8*2 + 微調整(0.25*マス目) + 32

  return { x: screenX, y: screenY }
}

export function diagonalToGrid(X: number, Y: number): GridPosition {
  const x = X + Y - 1
  const y = Y - X
  return { gridX: x, gridY: y }
}
