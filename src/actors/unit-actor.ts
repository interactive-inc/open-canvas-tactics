import { Actor, Animation, Vector, vec } from "excalibur"
import { getInitialPosition } from "@/constants/isometric"
import { characterSpriteSheet } from "@/sprite-sheets/character-sprite-sheet"

export class UnitActor extends Actor {
  constructor() {
    const initialPos = getInitialPosition()

    super({
      pos: new Vector(initialPos.x, initialPos.y),
      width: 32,
      height: 32,
      z: 1000,
    })

    // スケール設定
    this.scale = vec(0.1875, 0.1875)

    // 歩行アニメーションを作成
    const walkAnimation = Animation.fromSpriteSheet(
      characterSpriteSheet,
      [0, 1, 2, 3, 4, 5],
      100,
    )

    // アニメーションを設定
    this.graphics.use(walkAnimation)
  }

  moveToPosition(x: number, y: number): Promise<void> {
    return this.actions
      .moveTo(new Vector(x, y), 200)
      .toPromise() as Promise<void>
  }

  attack(): void {
    this.actions
      .scaleBy(new Vector(1.5, 1.5), 0.2)
      .scaleBy(new Vector(0.67, 0.67), 0.2)
  }

  wait(): void {
    this.graphics.opacity = 0.5
    setTimeout(() => {
      this.graphics.opacity = 1
    }, 500)
  }
}
