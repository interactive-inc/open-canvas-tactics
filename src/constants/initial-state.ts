import type { RootState } from "@/reducers/root-state/root-state"

// アプリケーション全体の初期状態
export const INITIAL_STATE: RootState = {
  level: 2,
  unitPosition: {
    x: 4,
    y: 4,
  },
  map: {
    mapSample: {
      columns: 5,
      rows: 5,
      tileWidth: 32,
      tileHeight: 16,
      screenOriginY: 168,
      screenOffsetY: 34,
    },
  },
}
