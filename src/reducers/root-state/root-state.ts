export type RootState = {
  level: number
  unitPosition: {
    x: number
    y: number
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
