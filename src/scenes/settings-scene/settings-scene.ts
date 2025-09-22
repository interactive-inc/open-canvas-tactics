import { Scene } from "excalibur"

/**
 * Settings Scene
 */
export class SettingsScene extends Scene {
  static readonly name = "settings"

  override onInitialize(): void {
    console.log("Settings scene initialized")
  }

  override onActivate(): void {
    console.log("Settings scene activated")
  }

  override onDeactivate(): void {
    console.log("Settings scene deactivated")
  }
}
