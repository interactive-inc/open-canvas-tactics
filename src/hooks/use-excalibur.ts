import type { Engine } from "excalibur"
import { useEffect, useRef } from "react"

/**
 * Hook to integrate Excalibur.js with React
 */
export function useExcalibur(canvasId: string, engine: Engine | null) {
  const engineRef = useRef<Engine | null>(null)

  useEffect(() => {
    if (!engine || engineRef.current) return

    const canvas = document.getElementById(canvasId) as HTMLCanvasElement
    if (!canvas) return

    engineRef.current = engine
    engine.start().catch(console.error)

    return () => {
      if (engineRef.current) {
        engineRef.current.stop()
        engineRef.current = null
      }
    }
  }, [canvasId, engine])

  return engineRef.current
}
