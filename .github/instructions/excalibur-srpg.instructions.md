---
applyTo: "**/*.{ts,tsx}"
---

# Excalibur.js SRPG Development Instructions

## Overview

Excalibur.jsベースのSRPG（Simulation RPG）開発における設計原則とパターン。
ゲームエンジンレイヤーとビジネスロジックレイヤーの分離を重視。

## Core Architecture

### Layer Separation

```
UI Layer (React)          ←→ Redux State Management
     ↕
Game Logic Layer         ←→ RTK Query APIs
     ↕
Excalibur Rendering Layer ←→ Immutable Game Entities
```

### Entity-Actor Pattern

- **Entity**: イミュータブルなゲームデータ（Unit, Tile, Battle）
- **Actor**: ExcaliburのレンダリングとアニメーションのみWEEWJR担当
- **Component**: Actorの機能を分割（Sprite, Health, Animation等）

## Excalibur.js Integration Rules

### 1. Game State Management

```ts
// ✅ Good: Redux manages game state, Excalibur renders
class UnitActor extends Actor {
  constructor(private gameStore: GameStore) {
    super()
    
    // Listen to Redux state changes
    this.gameStore.subscribe(() => {
      this.syncWithGameState()
    })
  }
}

// ❌ Bad: Excalibur managing game state
class UnitActor extends Actor {
  hp: number // Game state in rendering layer
  
  takeDamage(damage: number) {
    this.hp -= damage // Business logic in rendering
  }
}
```

### 2. Input Handling

```ts
// ✅ Good: Input dispatches Redux actions
class TileActor extends Actor {
  onPointerDown() {
    this.gameStore.dispatch(tileActions.tileClicked({
      position: this.gridPosition
    }))
  }
}

// ❌ Bad: Direct state manipulation in Actor
class TileActor extends Actor {
  onPointerDown() {
    this.selectUnit() // Direct game logic
    this.showMoveOptions() // Mixed concerns
  }
}
```

### 3. Animation Flow

```ts
// ✅ Good: Animation then state update
async moveUnit(unitId: string, targetPosition: Position) {
  const unitActor = this.findActor(unitId)
  
  // 1. Play animation
  await unitActor.actions.moveTo(targetPosition).toPromise()
  
  // 2. Update game state after animation
  this.gameStore.dispatch(unitActions.unitMoved({
    id: unitId,
    position: targetPosition
  }))
}
```

## Component Design

### Excalibur Components

```ts
// Sprite rendering component
export class UnitSpriteComponent extends Component {
  updateFromEntity(entity: UnitEntity) {
    const sprite = this.getSpriteForUnit(entity)
    this.owner?.graphics.use(sprite)
  }
}

// Health display component  
export class UnitHealthComponent extends Component {
  showDamageAnimation(oldHp: number, newHp: number) {
    const damage = oldHp - newHp
    // Create floating damage text
  }
}
```

### Scene Management

```ts
export class BattleScene extends Scene {
  onInitialize() {
    // Create grid of tile actors
    this.createMapGrid()
    
    // Listen for unit spawns from Redux
    this.gameStore.subscribe(() => {
      this.syncUnitsWithState()
    })
  }

  private syncUnitsWithState() {
    const units = selectAllUnits(this.gameStore.getState())
    
    // Add/remove/update unit actors based on state
    units.forEach(unit => {
      this.updateOrCreateUnitActor(unit)
    })
  }
}
```

## Resource Management

### Asset Loading

```ts
const Resources = {
  // Unit sprites
  UnitWarrior: new ImageSource('/assets/units/warrior.png'),
  UnitMage: new ImageSource('/assets/units/mage.png'),
  
  // Terrain sprites
  TerrainGrass: new ImageSource('/assets/terrain/grass.png'),
  TerrainMountain: new ImageSource('/assets/terrain/mountain.png'),
  
  // UI sprites
  MovementHighlight: new ImageSource('/assets/ui/highlight_blue.png'),
  AttackRange: new ImageSource('/assets/ui/highlight_red.png')
}

const loader = new Loader([
  ...Object.values(Resources)
])
```

### Sprite Sheets

```ts
export class UnitSpriteSheet {
  private readonly spriteSheet: SpriteSheet
  
  constructor(imageSource: ImageSource, unitClass: UnitClass) {
    this.spriteSheet = SpriteSheet.fromImageSource({
      image: imageSource,
      grid: {
        rows: 4, // directions
        columns: 3, // animation frames
        spriteWidth: 32,
        spriteHeight: 32
      }
    })
  }

  getIdleSprite(direction: Direction): Sprite {
    return this.spriteSheet.getSprite(direction, 0)
  }
  
  getWalkAnimation(direction: Direction): Animation {
    return Animation.fromSpriteSheet(
      this.spriteSheet,
      [0, 1, 2, 1], // frame sequence
      200 // frame duration
    )
  }
}
```

## Game Systems Integration

### Battle System

```ts
export class BattleSystem {
  constructor(
    private readonly calculator: DamageCalculator,
    private readonly scene: BattleScene
  ) {}

  async executeBattleAnimation(
    attacker: UnitEntity,
    defender: UnitEntity,
    result: BattleResult
  ) {
    const attackerActor = this.scene.findUnitActor(attacker.id)
    const defenderActor = this.scene.findUnitActor(defender.id)

    // 1. Move attacker adjacent to defender
    await attackerActor.moveToAdjacent(defender.position)
    
    // 2. Play attack animation
    await attackerActor.playAttackAnimation()
    
    // 3. Show damage effect on defender
    await defenderActor.showDamageEffect(result.damage)
    
    // 4. Return attacker to original position
    await attackerActor.moveToPosition(attacker.position)
    
    // 5. Update game state after all animations
    return result
  }
}
```

### Movement System with Animation

```ts
export class MovementSystem {
  async moveUnitWithAnimation(
    unit: UnitEntity,
    path: Position[],
    scene: BattleScene
  ) {
    const unitActor = scene.findUnitActor(unit.id)
    
    // Animate along path
    for (const position of path) {
      await unitActor.actions.moveTo(
        new Vector(position.x * TILE_SIZE, position.y * TILE_SIZE),
        300
      ).toPromise()
    }
    
    // Update game state after animation completes
    scene.gameStore.dispatch(unitActions.unitMoved({
      id: unit.id,
      position: path[path.length - 1]
    }))
  }
}
```

## Performance Optimization

### Object Pooling

```ts
export class EffectPool {
  private readonly pool: DamageTextActor[] = []
  
  getDamageText(damage: number, position: Vector): DamageTextActor {
    let actor = this.pool.pop()
    if (!actor) {
      actor = new DamageTextActor()
    }
    
    actor.reset(damage, position)
    return actor
  }
  
  returnToPool(actor: DamageTextActor) {
    actor.reset()
    this.pool.push(actor)
  }
}
```

### Culling

```ts
export class BattleScene extends Scene {
  onPreUpdate() {
    const camera = this.camera
    
    // Cull actors outside camera view
    this.actors.forEach(actor => {
      const inView = camera.getFocus().distance(actor.pos) < CULL_DISTANCE
      actor.visible = inView
    })
  }
}
```

## Development Guidelines

### File Organization

```
src/engine/
├── actors/
│   ├── unit-actor.ts          # UnitActor class
│   ├── tile-actor.ts          # TileActor class  
│   └── effect-actors.ts       # DamageText etc.
│
├── components/
│   ├── unit-sprite.component.ts
│   ├── unit-health.component.ts
│   └── tile-highlight.component.ts
│
├── scenes/
│   ├── battle.scene.ts
│   ├── menu.scene.ts
│   └── loading.scene.ts
│
└── resources/
    ├── sprite-sheets.ts
    ├── animations.ts
    └── resource-loader.ts
```

### Testing Strategy

```ts
describe('UnitActor', () => {
  let mockStore: MockStore
  let unitActor: UnitActor
  
  beforeEach(() => {
    mockStore = createMockStore()
    unitActor = new UnitActor(mockUnitEntity, mockStore)
  })
  
  test('should sync with Redux state changes', async () => {
    const newEntity = mockUnitEntity.withPosition(5, 5)
    mockStore.dispatch(unitActions.unitMoved({
      id: 'unit1',
      position: { x: 5, y: 5 }
    }))
    
    // Wait for subscription callback
    await nextTick()
    
    expect(unitActor.pos).toEqual(new Vector(5 * TILE_SIZE, 5 * TILE_SIZE))
  })
})
```

### Error Handling

```ts
export class GameErrorHandler {
  static handleActorError(actor: Actor, error: Error) {
    console.error(`Actor error in ${actor.name}:`, error)
    
    // Reset actor to safe state
    actor.actions.clearActions()
    actor.vel = Vector.Zero
    
    // Notify Redux of error state
    store.dispatch(errorActions.actorError({
      actorId: actor.id,
      error: error.message
    }))
  }
}
```

## Best Practices

### 1. **Single Responsibility**: ActorはレンダリングとアニメーションのみWEEWJR
### 2. **State Management**: ゲーム状態は常にReduxで管理  
### 3. **Animation First**: アニメーション完了後に状態更新
### 4. **Resource Pooling**: 頻繁に生成されるエフェクト等はプール化
### 5. **Performance Monitoring**: フレームレートとメモリ使用量を監視

## Constants

```ts
export const GAME_CONFIG = {
  TILE_SIZE: 64,
  ANIMATION_SPEED: 300,
  CAMERA_ZOOM: 1.0,
  MAX_ZOOM: 3.0,
  MIN_ZOOM: 0.5
} as const
```