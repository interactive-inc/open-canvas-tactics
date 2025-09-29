import { createFileRoute } from "@tanstack/react-router"
import { useContext, useState } from "react"
import { EngineContext } from "@/contexts/engine-context"
import { MainScene } from "@/scenes/main-scene/main-scene"
import { MainSceneComponent } from "@/scenes/main-scene/main-scene-component"
import { SettingsScene } from "@/scenes/settings-scene/settings-scene"
import { SettingsSceneComponent } from "@/scenes/settings-scene/settings-scene-component"

export const Route = createFileRoute("/")({
  component: Component,
})

function Component() {
  const engineContext = useContext(EngineContext)
  const engine = engineContext.engine

  const scene = engine.currentScene

  const [, setSceneName] = useState(engine.currentSceneName)

  const onGoToScene = async (sceneName: string) => {
    await engine.goToScene(sceneName)
    setSceneName(sceneName)
  }

  // シーンごとにコンポーネントを切り替え
  if (scene instanceof MainScene) {
    return <MainSceneComponent scene={scene} onGoToScene={onGoToScene} />
  }

  if (scene instanceof SettingsScene) {
    return <SettingsSceneComponent scene={scene} onGoToScene={onGoToScene} />
  }

  // デフォルトの表示
  return <div>{"No scene loaded"}</div>
}
