import { TiledResource } from "@excaliburjs/plugin-tiled"
import { Color, DisplayMode, Engine, Loader } from "excalibur"
import { useEffect, useRef } from "react"

type Props = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  onEngineReady: (engine: Engine) => void
}

/**
 * ゲームエンジンの初期化とマップロードを管理するコンポーネント
 */
export function GameEngine(props: Props) {
  const engineRef = useRef<Engine | null>(null)
  const isInitializedRef = useRef(false)

  useEffect(() => {
    if (!props.canvasRef.current) return
    if (isInitializedRef.current) return

    // 重複初期化を防ぐ
    if (isInitializedRef.current) {
      console.log("GameEngine: Already initialized, skipping")
      return
    }

    isInitializedRef.current = true
    console.log("GameEngine: Initializing engine...")

    // ゲームエンジンを初期化
    const engine = new Engine({
      canvasElement: props.canvasRef.current,
      displayMode: DisplayMode.FillContainer,
      pixelArt: true,
      antialiasing: false,
      backgroundColor: Color.fromHex("#ADD8E6"),
    })

    engineRef.current = engine

    // Tiledマップリソースを作成
    const tiledMapResource = new TiledResource("/map/map-test.json", {
      pathMap: [
        { path: "map/map-test.json", output: "/map/map-test.json" },
        { path: "spritesheet.tsx", output: "/tileset/spritesheet.tsx" },
        { path: "spritesheet.png", output: "/tileset/spritesheet.png" },
      ],
    })

    // ローダーを作成
    const loader = new Loader()
    loader.addResource(tiledMapResource)

    // ゲームを開始
    engine.start(loader).then(() => {
      console.log("GameEngine: Game engine started!")

      // TiledResourceをシーンに追加
      tiledMapResource.addToScene(engine.currentScene)
      console.log("GameEngine: Map added to scene")

      // 親コンポーネントにエンジンを渡す
      props.onEngineReady(engine)
      console.log("GameEngine: Engine ready callback called")
    })

    // クリーンアップ
    return () => {
      console.log("GameEngine: Cleaning up engine")
      if (engineRef.current) {
        engineRef.current.stop()
        engineRef.current = null
      }
      isInitializedRef.current = false
    }
  }, [props.canvasRef, props.onEngineReady])

  return null
}
