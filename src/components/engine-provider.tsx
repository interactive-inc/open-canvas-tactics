import type { Engine } from "excalibur"
import { EngineContext } from "@/contexts/engine-context"
import type { RootState } from "@/reducers/root-state/root-state"

type Props = {
  children: React.ReactNode
  engine: Engine
  initialState: RootState
}

export function EngineProvider(props: Props) {
  const value = {
    engine: props.engine,
    initialState: props.initialState,
  }

  return (
    <EngineContext.Provider value={value}>
      {props.children}
    </EngineContext.Provider>
  )
}
