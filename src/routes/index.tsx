import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: () => (
    <div className="flex items-center justify-center h-full p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Hello SRPG
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Vite + React + TypeScript + Redux Toolkit + Excalibur.js
        </p>
      </div>
    </div>
  ),
})
