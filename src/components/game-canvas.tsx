import type { Engine } from "excalibur"
import { useCallback, useRef, useState } from "react"
import { CameraController } from "./game/camera-controller"
import { GameEngine } from "./game/game-engine"
import { InputController } from "./game/input-controller"

/**
 * ゲームキャンバスのメインコンポーネント
 * DOM要素の表示のみを担当し、ゲーム機能は各専用コンポーネントに委譲
 */
export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [engine, setEngine] = useState<Engine | null>(null)

  const handleEngineReady = useCallback((readyEngine: Engine) => {
    setEngine(readyEngine)
    console.log("Engine ready and passed to controllers")
  }, [])

  return (
    <>
      {/* ゲーム機能コンポーネント群（DOM構造の外側） */}
      <GameEngine canvasRef={canvasRef} onEngineReady={handleEngineReady} />
      <CameraController engine={engine} />
      <InputController engine={engine} />

      {/* ゲームキャンバスのDOM要素 */}
      <div className="flex items-center justify-center p-4 w-full max-w-[1200px] h-[70vh]">
        <canvas
          ref={canvasRef}
          className="border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-w-full"
        />
      </div>
    </>
  )
}
