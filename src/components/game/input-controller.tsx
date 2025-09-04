import type { Engine } from "excalibur"
import { useEffect } from "react"

type Props = {
  engine: Engine | null
}

/**
 * マウス・タッチ入力によるカメラ操作を管理するコンポーネント
 */
export function InputController(props: Props) {
  useEffect(() => {
    if (!props.engine) return

    console.log("Setting up input controls")

    // マウスホイールでズーム機能
    props.engine.input.pointers.on("wheel", (wheelEvent) => {
      const camera = props.engine?.currentScene.camera
      const zoomSpeed = 0.05
      const minZoom = 1.0
      const maxZoom = 3.0

      // ホイールの方向に応じてズームイン/アウト
      if (!camera) return
      if (wheelEvent.deltaY < 0) {
        // ズームイン
        camera.zoom = Math.min(camera.zoom + zoomSpeed, maxZoom)
      } else {
        // ズームアウト
        camera.zoom = Math.max(camera.zoom - zoomSpeed, minZoom)
      }

      console.log("Camera zoom:", camera.zoom)
    })

    // マウスドラッグでカメラ移動機能
    let isDragging = false
    let lastPointerPos = { x: 0, y: 0 }

    // マウス押下時
    props.engine.input.pointers.on("down", (pointerEvent) => {
      isDragging = true
      lastPointerPos = {
        x: pointerEvent.screenPos.x,
        y: pointerEvent.screenPos.y,
      }
    })

    // マウス移動時（ドラッグ中）
    props.engine.input.pointers.on("move", (pointerEvent) => {
      if (!isDragging) return

      const camera = props.engine?.currentScene.camera
      const deltaX = pointerEvent.screenPos.x - lastPointerPos.x
      const deltaY = pointerEvent.screenPos.y - lastPointerPos.y

      if (!camera) return

      // カメラ移動速度（ズームレベルに応じて調整）
      const moveSpeed = 0.5 / camera.zoom

      // カメラをドラッグの逆方向に移動（自然な操作感）
      camera.pos.x -= deltaX * moveSpeed
      camera.pos.y -= deltaY * moveSpeed

      // 現在の位置を更新
      lastPointerPos = {
        x: pointerEvent.screenPos.x,
        y: pointerEvent.screenPos.y,
      }
    })

    // マウス離上時
    props.engine.input.pointers.on("up", () => {
      isDragging = false
    })

    console.log(
      "Input controls enabled: wheel zoom, click-drag camera movement",
    )
  }, [props.engine])

  return null // このコンポーネントは何も描画しない
}
