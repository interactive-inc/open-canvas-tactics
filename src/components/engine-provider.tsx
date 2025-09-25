import type { Engine } from "excalibur"
import { EngineContext } from "@/contexts/engine-context"
import type { MainSceneState } from "@/scenes/main-scene/main-scene-state"

type Props = {
  children: React.ReactNode
  engine: Engine
}

export function EngineProvider(props: Props) {
  type RootState = {
    level: number
    scene: MainSceneState
  }

  return (
    <EngineContext.Provider value={props.engine}>
      {props.children}
    </EngineContext.Provider>
  )
}
