import { Scene, vec } from "excalibur"
import { UnitActor } from "@/actors/unit-actor"
import { resources } from "@/resources"

export class MainScene extends Scene {
  static name = "main" as const

  public unit: UnitActor | null = null

  override onInitialize(): void {
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

    // UnitActorを作成してシーンに追加
    this.unit = new UnitActor()

    this.add(this.unit)

    // TiledResourceを最後に追加
    resources.tiledMapResource.addToScene(this.engine.currentScene, {
      pos: vec(0, 0),
    })
  }

  public updateUnitPosition(x: number, y: number): void {
    if (!this.unit) return
    this.unit.actions.moveTo(x, y, 300)
  }

  public attackWithUnit(): void {
    if (!this.unit) {
      console.warn("Unit not found in scene")
      return
    }
    this.unit.attack()
  }

  public makeUnitWait(): void {
    if (!this.unit) {
      console.warn("Unit not found in scene")
      return
    }
    this.unit.wait()
  }
}
