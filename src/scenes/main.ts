import { Actor, Animation, Scene, vec } from "excalibur"
import { resources } from "@/resources"
import { characterSpriteSheet } from "@/sprite-sheets/character-sprite-sheet"

export class MainScene extends Scene {
  static name = "main" as const

  onInitialize(): void {
    // マウスホイールでズーム機能
    this.engine.input.pointers.on("wheel", (wheelEvent) => {
      const camera = this.engine.currentScene.camera
      const zoomSpeed = 0.05
      const minZoom = 1.0
      const maxZoom = 4.0

      if (wheelEvent.deltaY < 0) {
        // ズームイン
        camera.zoom = Math.min(camera.zoom + zoomSpeed, maxZoom)
      } else {
        // ズームアウト
        camera.zoom = Math.max(camera.zoom - zoomSpeed, minZoom)
      }
    })

    // マウスドラッグでカメラ移動機能
    let isDragging = false
    let lastPointerPos = { x: 0, y: 0 }

    this.engine.input.pointers.on("down", (pointerEvent) => {
      isDragging = true
      lastPointerPos = {
        x: pointerEvent.screenPos.x,
        y: pointerEvent.screenPos.y,
      }
    })

    this.engine.input.pointers.on("move", (pointerEvent) => {
      if (!isDragging) return

      const camera = this.engine.currentScene.camera
      const deltaX = pointerEvent.screenPos.x - lastPointerPos.x
      const deltaY = pointerEvent.screenPos.y - lastPointerPos.y

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

    this.engine.input.pointers.on("up", () => {
      isDragging = false
    })

    // カメラの初期設定
    const mapColumns = 5 // マップの列数
    const mapRows = 5 // マップの行数
    const tileWidth = 32 // タイルの幅
    const tileHeight = 16 // タイルの高さ（アイソメトリック用）

    // アイソメトリックマップの中央座標を計算
    const mapPixelWidth =
      mapColumns * (tileWidth / 2) + mapRows * (tileWidth / 2)
    const mapPixelHeight =
      mapRows * (tileHeight / 2) + mapColumns * (tileHeight / 2)

    // カメラをマップの中央に配置
    this.engine.currentScene.camera.pos.x = mapPixelWidth / 2
    this.engine.currentScene.camera.pos.y = mapPixelHeight * 2
    this.engine.currentScene.camera.zoom = 1.5

    // アイソメトリックマップの中央座標を計算
    const mapGridX = 80
    const mapGridY = 160

    const screenX = -(mapGridX - mapGridY) - 32
    const screenY = mapGridX + mapGridY - 62 + 12

    // キャラクターアクターを作成
    const character = new Actor({
      pos: vec(screenX, screenY),
      z: 1000,
    })

    character.scale = vec(0.1875, 0.1875)

    // 歩行アニメーションを作成
    const walkAnimation = Animation.fromSpriteSheet(
      characterSpriteSheet,
      [0, 1, 2, 3, 4, 5],
      100,
    )

    // アニメーションをキャラクターに設定
    character.graphics.use(walkAnimation)

    // キャラクターをシーンに追加
    this.engine.currentScene.add(character)

    // TiledResourceを最後に追加
    resources.tiledMapResource.addToScene(this.engine.currentScene, {
      pos: vec(0, 0),
    })
  }
}
