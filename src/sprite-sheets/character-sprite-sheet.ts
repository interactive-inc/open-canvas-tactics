import { SpriteSheet } from "excalibur"
import { resources } from "@/resources"

export const characterSpriteSheet = SpriteSheet.fromImageSource({
  image: resources.characterImage,
  grid: {
    columns: 6,
    rows: 1,
    spriteWidth: 128,
    spriteHeight: 128,
  },
})
