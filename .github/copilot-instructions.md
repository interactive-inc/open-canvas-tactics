---
applyTo: "**/*"
---

# Overview

Excalibur.js + React SRPG game with clean separation between game engine and UI layer. Features isometric tile-based movement, turn-based combat, and reactive UI components.

## Architecture Design

### Layer Separation Strategy
- **Game Engine (Excalibur.js)**: Handles rendering, animation, and visual representation
- **React UI**: Manages user interface, controls, and game state display
- **Communication**: React components access engine via EngineContext, call scene methods directly

### Key Design Principles
1. **Scene-Centric Logic**: All game logic belongs in Scene classes (e.g., MainScene), not in Engine
2. **Component Per Scene**: Each scene has dedicated React component (e.g., MainSceneComponent)
3. **Type-Safe Scene Switching**: Use `instanceof` checks to determine current scene and render appropriate UI
4. **No GameEngine Wrapper**: Use vanilla Excalibur Engine class, avoid unnecessary abstractions

## Directory Structure

- `src/` - Main application source code
  - `actors/` - Excalibur Actor classes (units, tiles, effects)
  - `components/` - React components
    - `scenes/` - Scene-specific UI components (main-scene-component.tsx)
    - `ui/` - shadcn/ui component library (buttons, forms, dialogs, etc.)
  - `constants/` - Game constants (isometric.ts for grid calculations)
  - `contexts/` - React contexts (EngineContext for game engine access)
  - `features/` - Redux store and slices
  - `hooks/` - React hooks for state management
  - `lib/` - Core libraries and utilities
  - `routes/` - Page components and routes with TanStack Router
  - `scenes/` - Excalibur Scene classes with game logic
  - `sprite-sheets/` - Sprite sheet definitions
- `public/` - Static assets
  - `map/` - Tiled map files (.json)
  - `tileset/` - Tiled tileset files (.tsx - XML format, NOT TypeScript)

## Game-Specific Patterns

### Scene Method Organization

```typescript
// MainScene methods follow this pattern:
class MainScene extends Scene {
  // Direct movement
  moveUnit(x: number, y: number): Promise<void>

  // Grid-based movement
  moveUnitByGrid(gridX: number, gridY: number): Promise<void>
  moveUnitToRight(): Promise<void>
  moveUnitToInitialPosition(): Promise<void>

  // Combat actions
  attackWithUnit(): void
  makeUnitWait(): void
}
```

### React-Engine Integration
```typescript
// index.tsx pattern
const scene = gameEngine.currentScene
if (scene instanceof MainScene) {
  return <MainSceneComponent scene={scene} />
}
```

### Isometric Grid System
- Grid movement constants in `constants/isometric.ts`
- `GRID_MOVE_X: 16, GRID_MOVE_Y: 8` for tile-based movement
- Initial position calculation via `getInitialPosition()`

## Technical Features

- Excalibur.js for game rendering and physics
- TanStack Router for type-safe routing
- React 19 with TypeScript
- Redux Toolkit for game state management
- shadcn/ui component system
- Tailwind CSS v4 for styling
- Vite for build tooling
- Bun for package management and testing
- Biome for linting and formatting

## Important Notes

### Tiled Map Editor Files
- `.tsx` files in `public/tileset/` are **XML tileset definitions**, not TypeScript
- Do NOT rename or convert these files
- Edit only with Tiled Map Editor

### Development Rules
- Always start game engine before React renders (`await engine.start(loader)`)
- Scene logic stays in Scene classes, not in React components
- React components only call Scene methods, never directly manipulate Actors
- Use EngineContext to access engine from any component
