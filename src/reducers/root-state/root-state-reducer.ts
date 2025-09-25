import type { RootState } from "@/reducers/root-state/root-state"
import type { RootStateAction } from "@/reducers/root-state/root-state-action"

export function rootStateReducer(
  state: RootState,
  action: RootStateAction,
): RootState {
  if (action.type === "INCREMENT_LEVEL") {
    return {
      ...state,
      level: state.level + 1,
    }
  }

  if (action.type === "SET_LEVEL") {
    return {
      ...state,
      level: action.value,
    }
  }

  if (action.type === "SET_UNIT_POSITION") {
    return {
      ...state,
      unitPosition: {
        x: action.x,
        y: action.y,
      },
    }
  }

  if (action.type === "MOVE_UNIT") {
    return {
      ...state,
      unitPosition: {
        x: state.unitPosition.x + action.dx,
        y: state.unitPosition.y + action.dy,
      },
    }
  }

  return state
}
