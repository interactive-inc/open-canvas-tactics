import { createFileRoute } from "@tanstack/react-router"
import { useContext } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EngineContext } from "@/contexts/engine-context"

export const Route = createFileRoute("/")({
  component: Component,
})

function Component() {
  const _engine = useContext(EngineContext)

  console.log("_engine", _engine)

  return (
    <>
      {/* 左側のサイドバー */}
      <div
        className="fixed left-0 top-0 bottom-20 p-4 z-40"
        style={{ pointerEvents: "auto" }}
      >
        <Card className="p-0">
          <CardContent className="p-4 space-y-2">
            <Button className="w-full" variant="default">
              攻撃
            </Button>
            <Button className="w-full" variant="secondary">
              移動
            </Button>
            <Button className="w-full" variant="outline">
              待機
            </Button>
            <Button className="w-full" variant="destructive">
              キャンセル
            </Button>
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
              <Button variant="secondary">メニュー</Button>
            </div>
            <div className="text-lg font-semibold">ターン: 1</div>
          </div>
        </Card>
      </div>
    </>
  )
}
