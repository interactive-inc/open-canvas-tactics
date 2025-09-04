import type { Engine } from "excalibur"
import { useEffect } from "react"

type Props = {
  engine: Engine | null
}

/**
 * カメラの位置とズームを管理するコンポーネント
 */
export function CameraController(props: Props) {
  useEffect(() => {
    if (!props.engine) return

    console.log("Setting up camera for isometric map")

    const mapColumns = 5 // マップの列数
    const mapRows = 5 // マップの行数
    const tileWidth = 32 // タイルの幅
    const tileHeight = 16 // タイルの高さ（アイソメトリック用）

    // アイソメトリックマップの中央座標を計算
    const mapPixelWidth =
      mapColumns * (tileWidth / 2) + mapRows * (tileWidth / 2)
    const mapPixelHeight =
      mapRows * (tileHeight / 2) + mapColumns * (tileHeight / 2)

    console.log("Calculated map pixel size:", {
      width: mapPixelWidth,
      height: mapPixelHeight,
      tileSize: { width: tileWidth, height: tileHeight },
      mapSize: { columns: mapColumns, rows: mapRows },
    })

    // カメラをマップの中央に配置
    props.engine.currentScene.camera.pos.x = mapPixelWidth / 2
    props.engine.currentScene.camera.pos.y = mapPixelHeight * 2

    console.log("Isometric camera positioned:", {
      x: props.engine.currentScene.camera.pos.x,
      y: props.engine.currentScene.camera.pos.y,
      mapSize: { width: mapPixelWidth, height: mapPixelHeight },
      tileSize: { width: tileWidth, height: tileHeight },
    })

    // ズームレベルを調整
    props.engine.currentScene.camera.zoom = 1.5
  }, [props.engine])

  return null // このコンポーネントは何も描画しない
}
