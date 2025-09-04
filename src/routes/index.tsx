import { createFileRoute } from "@tanstack/react-router"
import { GameCanvas } from "../components/game-canvas"

export const Route = createFileRoute("/")({
  component: () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Hello SRPG
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Vite + React + TypeScript + Redux Toolkit + Excalibur.js
        </p>
      </div>
      <GameCanvas />
    </div>
  ),
})
