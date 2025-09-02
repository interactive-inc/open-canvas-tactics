import { createRouter, RouterProvider } from "@tanstack/react-router"
import React from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { routeTree } from "./route-tree.gen"
import { store } from "./store"
import "./index.css"

const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

const container = document.getElementById("root")
if (!container) throw new Error("Failed to find the root element")

const root = createRoot(container)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
