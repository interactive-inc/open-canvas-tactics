import { createFileRoute } from "@tanstack/react-router"
import { useContext } from "react"
import { MainSceneComponent } from "@/components/scenes/main-scene-component"
import { EngineContext } from "@/contexts/engine-context"
import { MainScene } from "@/scenes/main"

export const Route = createFileRoute("/")({
  component: Component,
})

function Component() {
  const gameEngine = useContext(EngineContext)

  if (!gameEngine) {
    return <div>Loading game engine...</div>
  }

  const scene = gameEngine.currentScene

  // シーンごとにコンポーネントを切り替え
  if (scene instanceof MainScene) {
    return <MainSceneComponent scene={scene} />
  }

  // デフォルトの表示
  return <div>{"No scene loaded"}</div>
}
