import type { Engine } from "excalibur"
import { createContext } from "react"

type Value = Engine

export const EngineContext = createContext<Value | undefined>(undefined)
