import type { Engine } from "excalibur"
import { createContext } from "react"
import type { RootState } from "@/reducers/root-state/root-state"

type EngineContextValue = {
  engine: Engine
  initialState: RootState
}

type Value = EngineContextValue

const proxy = new Proxy({} as Value, {
  get() {
    throw new Error("EngineContext must be provided")
  },
})

export const EngineContext = createContext<Value>(proxy)
