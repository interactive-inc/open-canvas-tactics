import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

export type GameStatus = "idle" | "loading" | "playing" | "paused" | "gameOver"

interface GameState {
  status: GameStatus
  currentLevel: number
  score: number
  playerHealth: number
  playerMaxHealth: number
  turn: number
  selectedUnit: string | null
}

const initialState: GameState = {
  status: "idle",
  currentLevel: 1,
  score: 0,
  playerHealth: 100,
  playerMaxHealth: 100,
  turn: 1,
  selectedUnit: null,
}

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameStatus: (state, action: PayloadAction<GameStatus>) => {
      state.status = action.payload
    },
    startGame: (state) => {
      state.status = "playing"
      state.score = 0
      state.playerHealth = state.playerMaxHealth
      state.turn = 1
    },
    pauseGame: (state) => {
      if (state.status === "playing") {
        state.status = "paused"
      }
    },
    resumeGame: (state) => {
      if (state.status === "paused") {
        state.status = "playing"
      }
    },
    endGame: (state) => {
      state.status = "gameOver"
    },
    nextLevel: (state) => {
      state.currentLevel += 1
    },
    updateScore: (state, action: PayloadAction<number>) => {
      state.score += action.payload
    },
    setPlayerHealth: (state, action: PayloadAction<number>) => {
      state.playerHealth = Math.max(
        0,
        Math.min(action.payload, state.playerMaxHealth),
      )
    },
    incrementTurn: (state) => {
      state.turn += 1
    },
    selectUnit: (state, action: PayloadAction<string | null>) => {
      state.selectedUnit = action.payload
    },
  },
})

export const {
  setGameStatus,
  startGame,
  pauseGame,
  resumeGame,
  endGame,
  nextLevel,
  updateScore,
  setPlayerHealth,
  incrementTurn,
  selectUnit,
} = gameSlice.actions

export default gameSlice.reducer
