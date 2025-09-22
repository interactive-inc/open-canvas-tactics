import type { Engine } from "excalibur"
import { createContext } from "react"

type Value = Engine

const proxy = new Proxy({} as Value, {
  get() {
    throw new Error("EngineContext must be provided")
  },
})

export const EngineContext = createContext<Value>(proxy)
