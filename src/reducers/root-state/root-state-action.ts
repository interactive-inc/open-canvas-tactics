export type RootStateAction =
  | {
      type: "INCREMENT_LEVEL"
    }
  | {
      type: "SET_LEVEL"
      value: number
    }
  | {
      type: "SET_UNIT_POSITION"
      x: number
      y: number
    }
  | {
      type: "MOVE_UNIT"
      dx: number
      dy: number
    }
