import { TiledResource } from "@excaliburjs/plugin-tiled"
import {
  Actor,
  Animation,
  Color,
  DisplayMode,
  Engine,
  ImageSource,
  Loader,
  SpriteSheet,
  vec,
} from "excalibur"
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
    if (isInitializedRef.current) return // 重複初期化を防ぐ

    isInitializedRef.current = true

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

    // キャラクター画像を読み込み
    const characterImage = new ImageSource(
      "/character/mini-horse-man/mini-horse-man-common-walk.png",
    )
    loader.addResource(characterImage)

    // ゲームを開始
    engine.start(loader).then(() => {
      // キャラクターのスプライトシートを作成
      const characterSpriteSheet = SpriteSheet.fromImageSource({
        image: characterImage,
        grid: {
          columns: 6,
          rows: 1,
          spriteWidth: 128,
          spriteHeight: 128,
        },
      })

      // アイソメトリックマップの中央座標を計算
      const mapGridX = 80 // マップの中央X座標
      const mapGridY = 160 // マップの中央Y座標

      // アイソメトリック座標をスクリーン座標に変換
      // const screenX = -(mapGridX - mapGridY)
      // const screenY = (mapGridX + mapGridY) / 1.35

      // X軸は0,16,48の法則でマス目のちょうど真ん中にくる
      // Y軸は0, 12, 28の法則でマス目のちょうど真ん中にくる(補正は-62か、/1.35で大丈夫そう)
      // X軸は16を基準にするとうまく移動できそう
      // Y軸はまだ調整が必要そう。0より下がる時は0,6,22? 0より上がる時は、12,28,44?
      const screenX = -(mapGridX - mapGridY) - 32
      const screenY = mapGridX + mapGridY - 62 + 12
      // キャラクターアクターを作成
      const character = new Actor({
        pos: vec(screenX, screenY), // アイソメトリック計算による適切な位置
        z: 1000, // 非常に高いz値で確実に前面に配置
      })

      character.scale = vec(0.1875, 0.1875) // 32x32タイルに合わせて縮小

      // 歩行アニメーションを作成
      const walkAnimation = Animation.fromSpriteSheet(
        characterSpriteSheet,
        [0, 1, 2, 3, 4, 5], // 6フレーム全て使用
        100, // 各フレームの表示時間（ミリ秒）
      )

      // アニメーションをキャラクターに設定
      character.graphics.use(walkAnimation)

      // キャラクターをシーンに追加
      engine.currentScene.add(character)

      // TiledResourceを最後に追加（既にActorが存在する状態で）
      tiledMapResource.addToScene(engine.currentScene, { pos: vec(0, 0) })

      console.log(
        "Character added to scene at position:",
        character.pos,
        "z:",
        character.z,
      )
      console.log("Map added to scene")
      console.log("Total actors in scene:", engine.currentScene.actors.length)

      // 親コンポーネントにエンジンを渡す
      props.onEngineReady(engine)
    })

    // クリーンアップ
    return () => {
      if (engineRef.current) {
        engineRef.current.stop()
        engineRef.current = null
      }
      isInitializedRef.current = false
    }
  }, [props.canvasRef, props.onEngineReady])

  return null
}
