import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SettingsScene } from "@/scenes/settings-scene/settings-scene"

type Props = {
  scene: SettingsScene
  onGoToScene(sceneName: string): Promise<void>
}

/**
 * Settings Scene Component
 */
export function SettingsSceneComponent(props: Props) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/80">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>設定</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            ゲームの設定画面です。
          </div>

          <div className="border-t pt-4">
            <Button
              onClick={() => props.onGoToScene("main")}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              メインシーンに戻る
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
