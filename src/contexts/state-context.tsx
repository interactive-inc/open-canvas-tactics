import { type ActionDispatch, createContext } from "react"
import type { RootState } from "@/reducers/root-state/root-state"
import type { RootStateAction } from "@/reducers/root-state/root-state-action"

type Value = [RootState, ActionDispatch<[RootStateAction]>]

const proxy = new Proxy({} as Value, {
  get() {
    throw new Error("StateContext must be provided")
  },
})

export const StateContext = createContext<Value>(proxy)
