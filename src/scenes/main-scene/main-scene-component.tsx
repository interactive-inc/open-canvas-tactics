import { useContext } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getInitialPosition, ISOMETRIC } from "@/constants/isometric"
import { StateContext } from "@/contexts/state-context"
import type { MainScene } from "@/scenes/main-scene/main-scene"

type Props = {
  scene: MainScene
  onGoToScene(sceneName: string): void
}

export function MainSceneComponent(props: Props) {
  const [state, dispatch] = useContext(StateContext)

  const onAttack = () => {
    props.scene.attackWithUnit()
  }

  const onMoveUp = () => {
    const newX = state.unitPosition.x - ISOMETRIC.GRID_MOVE_X
    const newY = state.unitPosition.y - ISOMETRIC.GRID_MOVE_Y
    props.scene.updateUnitPosition(newX, newY)
    dispatch({
      type: "SET_UNIT_POSITION",
      x: newX,
      y: newY,
    })
  }

  const onMoveDown = () => {
    const newX = state.unitPosition.x + ISOMETRIC.GRID_MOVE_X
    const newY = state.unitPosition.y + ISOMETRIC.GRID_MOVE_Y
    props.scene.updateUnitPosition(newX, newY)
    dispatch({
      type: "SET_UNIT_POSITION",
      x: newX,
      y: newY,
    })
  }

  const onMoveLeft = () => {
    const newX = state.unitPosition.x - ISOMETRIC.GRID_MOVE_X
    const newY = state.unitPosition.y + ISOMETRIC.GRID_MOVE_Y
    props.scene.updateUnitPosition(newX, newY)
    dispatch({
      type: "SET_UNIT_POSITION",
      x: newX,
      y: newY,
    })
  }

  const onMoveRight = () => {
    const newX = state.unitPosition.x + ISOMETRIC.GRID_MOVE_X
    const newY = state.unitPosition.y - ISOMETRIC.GRID_MOVE_Y
    props.scene.updateUnitPosition(newX, newY)
    dispatch({
      type: "SET_UNIT_POSITION",
      x: newX,
      y: newY,
    })
  }

  const onWait = () => {
    props.scene.makeUnitWait()
  }

  const onCancel = () => {
    const initialPos = getInitialPosition()
    props.scene.updateUnitPosition(initialPos.x, initialPos.y)
    dispatch({ type: "SET_UNIT_POSITION", x: initialPos.x, y: initialPos.y })
  }

  const onSettings = () => {
    props.onGoToScene("settings")
  }

  return (
    <>
      {/* 左側のコントローラー */}
      <div
        className="fixed left-0 top-0 bottom-20 p-4 z-40"
        style={{ pointerEvents: "auto" }}
      >
        <Card className="p-0">
          <CardContent className="p-4 space-y-2">
            <div className="text-center mb-2">
              <Button onClick={() => dispatch({ type: "INCREMENT_LEVEL" })}>
                {"レベル: "} {state.level}
              </Button>
            </div>
            {/* コントローラー */}
            <div className="grid grid-cols-3 gap-1 w-36 mx-auto">
              <div></div>
              <Button
                className="w-12 h-12"
                variant="secondary"
                onClick={onMoveUp}
              >
                ↑
              </Button>
              <div></div>
              <Button
                className="w-12 h-12"
                variant="secondary"
                onClick={onMoveLeft}
              >
                ←
              </Button>
              <div className="w-12 h-12"></div>
              <Button
                className="w-12 h-12"
                variant="secondary"
                onClick={onMoveRight}
              >
                →
              </Button>
              <div></div>
              <Button
                className="w-12 h-12"
                variant="secondary"
                onClick={onMoveDown}
              >
                ↓
              </Button>
              <div></div>
            </div>
            {/* アクションボタン */}
            <div className="space-y-2 mt-4">
              <Button className="w-full" variant="default" onClick={onAttack}>
                攻撃
              </Button>
              <Button className="w-full" variant="outline" onClick={onWait}>
                待機
              </Button>
              <Button
                className="w-full"
                variant="destructive"
                onClick={onCancel}
              >
                リセット
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* 右側のステータスパネル */}
      <div
        className="fixed right-0 top-0 p-4 z-10"
        style={{ pointerEvents: "auto" }}
      >
        <Card className="p-2 w-80">
          <div className="text-lg">ユニット情報</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">HP:</span>
              <span className="font-medium">100 / 100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">攻撃力:</span>
              <span className="font-medium">25</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">防御力:</span>
              <span className="font-medium">15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">移動力:</span>
              <span className="font-medium">5</span>
            </div>
          </div>
        </Card>
      </div>
      {/* 下部のコントロールバー */}
      <div
        className="fixed bottom-0 left-0 right-0 p-4 z-10"
        style={{ pointerEvents: "auto" }}
      >
        <Card className="p-2">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button>ターン終了</Button>
              <Button variant="secondary" onClick={onSettings}>
                設定
              </Button>
            </div>
            <div className="text-lg font-semibold">ターン: 1</div>
          </div>
        </Card>
      </div>
    </>
  )
}
