import { useEffect, useReducer } from "react"
import { INITIAL_STATE } from "@/constants/initial-state"
import { StateContext } from "@/contexts/state-context"
import { rootStateReducer } from "@/reducers/root-state/root-state-reducer"

type Props = {
  children: React.ReactNode
}

export function StateProvider(props: Props) {
  const [state, dispatch] = useReducer(rootStateReducer, INITIAL_STATE)

  useEffect(() => {
    console.log("on change!", state)
  }, [state])

  return (
    <StateContext.Provider value={[state, dispatch]}>
      {props.children}
    </StateContext.Provider>
  )
}
