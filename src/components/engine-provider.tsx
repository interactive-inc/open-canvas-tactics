import type { Engine } from "excalibur"
import { EngineContext } from "@/contexts/engine-context"

type Props = {
  children: React.ReactNode
  game: Engine
}

export function EngineProvider(props: Props) {
  return (
    <EngineContext.Provider value={props.game}>
      {props.children}
    </EngineContext.Provider>
  )
}
