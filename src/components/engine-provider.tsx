import type { Engine } from "excalibur"
import { EngineContext } from "@/contexts/engine-context"

type Props = {
  children: React.ReactNode
  engine: Engine
}

export function EngineProvider(props: Props) {
  return (
    <EngineContext.Provider value={props.engine}>
      {props.children}
    </EngineContext.Provider>
  )
}
