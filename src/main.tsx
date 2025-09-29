import { createRouter, RouterProvider } from "@tanstack/react-router"
import { Color, DisplayMode, Engine, Loader } from "excalibur"
import React from "react"
import { createRoot } from "react-dom/client"
import { INITIAL_STATE } from "@/constants/initial-state"
import { resources } from "@/resources"
import { MainScene } from "@/scenes/main-scene/main-scene"
import { SettingsScene } from "@/scenes/settings-scene/settings-scene"
import { EngineProvider } from "./components/engine-provider"
import { routeTree } from "./route-tree.gen"

import "./index.css"
import { StateProvider } from "@/components/state-provider"

const canvas = document.querySelector<HTMLCanvasElement>("canvas")

if (canvas === null) {
  throw new Error('Canvas element with id "game-canvas" not found')
}

// ゲームエンジンを初期化
const engine = new Engine({
  canvasElement: canvas,
  displayMode: DisplayMode.FillContainer,
  pixelArt: true,
  antialiasing: false,
  backgroundColor: Color.fromHex("#ADD8E6"),
  scenes: {
    // ここにシーンを登録
    [MainScene.name]: new MainScene(INITIAL_STATE),
    [SettingsScene.name]: SettingsScene,
  },
})

const loader = new Loader({
  loadables: Object.values(resources),
})

loader.suppressPlayButton = true

// ゲームを開始
await engine.start(loader)

engine.goToScene(MainScene.name)

const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

const container = document.getElementById("root")

if (container === null) {
  throw new Error("Failed to find the root element")
}

const root = createRoot(container)

root.render(
  <React.StrictMode>
    <StateProvider>
      <EngineProvider engine={engine} initialState={INITIAL_STATE}>
        <RouterProvider router={router} />
      </EngineProvider>
    </StateProvider>
  </React.StrictMode>,
)
