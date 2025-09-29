export type RootState = {
  level: number
  unitPosition: {
    x: number
    y: number
  }
  map: {
    mapSample: {
      columns: number
      rows: number
      tileWidth: number
      tileHeight: number
      screenOriginY: number
      screenOffsetY: number
    }
  }
}

// export type RootState =
//   | {
//       scene: "main"
//       level: number
//     }
//   | {
//       scene: "settings"
//       level: number
//       volume: number
//     }
