import { TiledResource } from "@excaliburjs/plugin-tiled"
import { ImageSource, Loader } from "excalibur"

export const resources = {
  characterImage: new ImageSource(
    "/character/mini-horse-man/mini-horse-man-common-walk.png",
  ),
  tiledMapResource: new TiledResource("/map/map-test.json", {
    pathMap: [
      { path: "map/map-test.json", output: "/map/map-test.json" },
      { path: "spritesheet.tsx", output: "/tileset/spritesheet.tsx" },
      { path: "spritesheet.png", output: "/tileset/spritesheet.png" },
    ],
  }),
}

export const loader = new Loader()

for (const resource of Object.values(resources)) {
  loader.addResource(resource)
}
