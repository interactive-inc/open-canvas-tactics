import { createRouter, RouterProvider } from "@tanstack/react-router"
import { Color, DisplayMode, Engine, Loader } from "excalibur"
import React from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { resources } from "@/resources"
import { MainScene } from "@/scenes/main"
import { EngineProvider } from "./components/engine-provider"
import { store } from "./features/store"
import { routeTree } from "./route-tree.gen"

import "./index.css"

const canvas = document.querySelector<HTMLCanvasElement>("#game-canvas")

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
    [MainScene.name]: MainScene,
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
    <Provider store={store}>
      <EngineProvider game={engine}>
        <RouterProvider router={router} />
      </EngineProvider>
    </Provider>
  </React.StrictMode>,
)
