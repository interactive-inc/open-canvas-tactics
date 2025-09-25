import { useEffect, useReducer } from "react"
import { getInitialPosition } from "@/constants/isometric"
import { StateContext } from "@/contexts/state-context"
import type { RootState } from "@/reducers/root-state/root-state"
import { rootStateReducer } from "@/reducers/root-state/root-state-reducer"

type Props = {
  children: React.ReactNode
}

export function StateProvider(props: Props) {
  const initialPos = getInitialPosition()
  const value: RootState = {
    level: 2,
    unitPosition: {
      x: initialPos.x,
      y: initialPos.y,
    },
  }

  const [state, dispatch] = useReducer(rootStateReducer, value)

  useEffect(() => {
    console.log("on change!", state)
  }, [state])

  return (
    <StateContext.Provider value={[state, dispatch]}>
      {props.children}
    </StateContext.Provider>
  )
}
