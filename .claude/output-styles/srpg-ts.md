---
name: srpg-ts
description: TypeScript code style for SRPG development with Excalibur.js
---

# SRPG TypeScript Output Style with Excalibur.js

Excalibur.jsベースのSRPGゲーム開発に特化したTypeScriptコーディングスタイル。
Excalibur.js、Redux Toolkit、RTK Query、React、ゲームエンティティ設計を統合。

## Subagents

以下の条件の場合は必ず対応するSubagentsに委託してください。

- `@agent-ts-errors` - TypeScriptのエラーを修正
- `@agent-ts-code-checker` - コード品質をチェック
- `@agent-srpg-entity-builder` - ゲームエンティティを構築
- `@agent-rtk-query-builder` - RTK Query APIを構築
- `@agent-bun-test-builder` - ゲームロジックのテストを作成

## Project Structure with Excalibur.js

```
src/
├── engine/              # Excalibur.js ゲームエンジン層
│   ├── actors/         # UnitActor, TileActor等のExcaliburアクター
│   ├── components/     # UnitSpriteComponent等のExcaliburコンポーネント
│   ├── scenes/         # BattleScene, MenuScene等のExcaliburシーン
│   ├── resources/      # Texture, SpriteSheet等のリソース管理
│   ├── entities/       # Unit, Tile, Battle等のデータエンティティ（イミュータブル）
│   ├── systems/        # バトル計算、移動判定等のピュアなゲームロジック
│   ├── values/         # Position, Stats等の値オブジェクト
│   └── types/          # ゲーム全体の型定義
│
├── excalibur/          # Excalibur.js統合層
│   ├── game.ts        # メインのExcaliburエンジン設定
│   ├── loader.ts      # リソースローダー設定
│   ├── input/         # 入力ハンドリング
│   └── utils/         # Excalibur固有のユーティリティ
│
├── features/           # Redux Toolkit層（ゲーム状態管理）
│   ├── battle/        # バトル状態管理
│   ├── units/         # ユニット管理
│   ├── map/           # マップ管理
│   ├── camera/        # カメラ制御
│   └── campaign/      # キャンペーン進行
│
├── services/          # RTK Query API層
│   ├── api.ts        # ベースAPI設定
│   ├── save.api.ts   # セーブデータAPI
│   ├── battle.api.ts # バトルAPI
│   └── units.api.ts  # ユニットAPI
│
├── ui/                # React UI層（ゲーム外UI）
│   ├── menus/        # メニュー画面
│   ├── hud/          # HUD/オーバーレイ
│   ├── dialogs/      # ダイアログ
│   └── components/   # 共通UIコンポーネント
│
├── hooks/            # カスタムフック
│   ├── use-excalibur.ts  # Excalibur統合フック
│   ├── use-game.ts
│   ├── use-battle.ts
│   └── use-units.ts
│
├── utils/            # ユーティリティ
├── constants/        # ゲーム定数
└── assets/           # ゲームアセット
    ├── sprites/
    ├── sounds/
    └── fonts/
```

## Excalibur.js + Redux Integration

### Entity-Actor Separation Pattern
```ts
import { Actor, Vector, Engine } from 'excalibur'

// ❌ Bad: Mixing game logic with rendering
class UnitActor extends Actor {
  hp: number
  attack: number
  
  takeDamage(damage: number) {
    this.hp -= damage // Game logic in Actor
    this.updateSprite() // Rendering mixed with logic
  }
}

// ✅ Good: Separate data entity and rendering actor
// Data Entity (Pure, Immutable)
export class UnitEntity {
  constructor(private readonly props: UnitProps) {
    Object.freeze(this)
  }

  get hp() { return this.props.stats.hp }
  get position() { return this.props.position }

  withDamage(damage: number): UnitEntity {
    return new UnitEntity({
      ...this.props,
      stats: {
        ...this.props.stats,
        hp: Math.max(0, this.props.stats.hp - damage)
      }
    })
  }
}

// Excalibur Actor (Rendering Only)
export class UnitActor extends Actor {
  constructor(
    private unitEntity: UnitEntity,
    private gameStore: GameStore
  ) {
    super({
      pos: new Vector(unitEntity.position.x * TILE_SIZE, unitEntity.position.y * TILE_SIZE)
    })
  }

  onInitialize(engine: Engine) {
    // Listen to Redux for state changes
    this.gameStore.subscribe(() => {
      const newEntity = selectUnitById(this.gameStore.getState(), this.unitEntity.id)
      if (newEntity !== this.unitEntity) {
        this.syncWithEntity(newEntity)
      }
    })
  }

  private syncWithEntity(entity: UnitEntity) {
    this.unitEntity = entity
    // Update visual representation based on entity state
    this.pos = new Vector(entity.position.x * TILE_SIZE, entity.position.y * TILE_SIZE)
    this.get(UnitSpriteComponent)?.updateSprite(entity)
  }
}
```

### Value Object Pattern
```ts
// Position as value object
export class Position {
  constructor(
    readonly x: number,
    readonly y: number
  ) {
    Object.freeze(this)
  }

  distanceTo(other: Position): number {
    return Math.abs(this.x - other.x) + Math.abs(this.y - other.y)
  }

  add(dx: number, dy: number): Position {
    return new Position(this.x + dx, this.y + dy)
  }

  equals(other: Position): boolean {
    return this.x === other.x && this.y === other.y
  }
}
```

## Redux Toolkit Patterns

### Slice Design
```ts
// ✅ Good: Domain-focused slice with normalized state
const unitsSlice = createSlice({
  name: 'units',
  initialState: unitsAdapter.getInitialState({
    selectedId: null as string | null,
    hoveredId: null as string | null
  }),
  reducers: {
    unitMoved(state, action: PayloadAction<{ id: string; position: Position }>) {
      const { id, position } = action.payload
      unitsAdapter.updateOne(state, {
        id,
        changes: { position }
      })
    },
    
    unitDamaged(state, action: PayloadAction<{ id: string; damage: number }>) {
      const unit = state.entities[action.payload.id]
      if (unit) {
        unit.stats.hp = Math.max(0, unit.stats.hp - action.payload.damage)
        if (unit.stats.hp === 0) {
          unit.status = 'defeated'
        }
      }
    }
  },
  extraReducers: (builder) => {
    // Handle RTK Query results
    builder.addMatcher(
      srpgApi.endpoints.loadSave.matchFulfilled,
      (state, action) => {
        unitsAdapter.setAll(state, action.payload.units)
      }
    )
  }
})
```

### Selector Patterns
```ts
// Memoized selectors for game logic
export const selectUnitById = createSelector(
  [selectUnitsState, (_: RootState, unitId: string) => unitId],
  (units, unitId) => units.entities[unitId]
)

export const selectUnitsInRange = createSelector(
  [selectAllUnits, (_: RootState, position: Position, range: number) => ({ position, range })],
  (units, { position, range }) => 
    units.filter(unit => 
      new Position(unit.position.x, unit.position.y).distanceTo(position) <= range
    )
)

export const selectAliveUnits = createSelector(
  [selectAllUnits],
  (units) => units.filter(unit => unit.stats.hp > 0)
)
```

## RTK Query Patterns

### API Slice with Tags
```ts
export const battleApi = srpgApi.injectEndpoints({
  endpoints: (builder) => ({
    executeAction: builder.mutation<ActionResult, GameAction>({
      query: (action) => ({
        url: '/battle/action',
        method: 'POST',
        body: action
      }),
      // Optimistic update for movement
      async onQueryStarted(action, { dispatch, queryFulfilled }) {
        if (action.type === 'move') {
          const patchResult = dispatch(
            unitsSlice.actions.unitMoved({
              id: action.unitId,
              position: action.position
            })
          )
          try {
            await queryFulfilled
          } catch {
            dispatch(undo(patchResult))
          }
        }
      },
      invalidatesTags: (result, error, action) => [
        { type: 'Unit', id: action.unitId },
        { type: 'Battle' }
      ]
    })
  })
})
```

## React Component Patterns

### Game Component with Hooks
```tsx
export function BattleField() {
  const dispatch = useAppDispatch()
  const selectedUnit = useSelectedUnit()
  const { moveUnit, attackUnit } = useBattleActions()
  const movementRange = useMovementRange(selectedUnit?.id)
  
  const handleTileClick = useCallback((position: Position) => {
    if (!selectedUnit) return
    
    if (movementRange.includes(position)) {
      moveUnit(selectedUnit.id, position)
    }
  }, [selectedUnit, movementRange, moveUnit])

  return (
    <div className="grid grid-cols-10 gap-0">
      {tiles.map(tile => (
        <Tile
          key={`${tile.x}-${tile.y}`}
          tile={tile}
          isInRange={movementRange.includes(tile.position)}
          onClick={() => handleTileClick(tile.position)}
        />
      ))}
    </div>
  )
}
```

### Custom Hooks for Game Logic
```ts
export function useBattleActions() {
  const dispatch = useAppDispatch()
  const [executeAction] = useExecuteActionMutation()
  
  const moveUnit = useCallback(async (unitId: string, position: Position) => {
    const action: GameAction = {
      type: 'move',
      unitId,
      position
    }
    
    try {
      await executeAction(action).unwrap()
      dispatch(showNotification({ type: 'success', message: 'Unit moved' }))
    } catch (error) {
      dispatch(showNotification({ type: 'error', message: 'Move failed' }))
    }
  }, [executeAction, dispatch])

  const attackUnit = useCallback(async (attackerId: string, targetId: string) => {
    const action: GameAction = {
      type: 'attack',
      unitId: attackerId,
      targetId
    }
    
    await executeAction(action).unwrap()
  }, [executeAction])

  return { moveUnit, attackUnit }
}
```

## Game Systems

### Battle Calculator
```ts
export class BattleCalculator {
  calculateDamage(props: DamageCalculationProps): DamageResult {
    const { attacker, defender, terrain } = props
    
    // Base damage calculation
    const baseDamage = attacker.stats.attack - defender.stats.defense
    
    // Apply weapon triangle
    const weaponModifier = this.getWeaponTriangleModifier(
      attacker.weapon.type,
      defender.weapon.type
    )
    
    // Apply terrain bonus
    const terrainBonus = terrain.defenseBonus
    
    // Calculate final damage
    const finalDamage = Math.max(
      1,
      Math.floor(baseDamage * weaponModifier - terrainBonus)
    )
    
    // Calculate critical
    const criticalRate = attacker.stats.skill - defender.stats.speed
    const isCritical = Math.random() * 100 < criticalRate
    
    return {
      damage: isCritical ? finalDamage * 3 : finalDamage,
      isCritical,
      accuracy: this.calculateAccuracy(attacker, defender, terrain)
    }
  }

  private getWeaponTriangleModifier(
    attackerWeapon: WeaponType,
    defenderWeapon: WeaponType
  ): number {
    const triangle = {
      sword: { axe: 1.2, lance: 0.8 },
      axe: { lance: 1.2, sword: 0.8 },
      lance: { sword: 1.2, axe: 0.8 }
    }
    
    return triangle[attackerWeapon]?.[defenderWeapon] ?? 1.0
  }
}
```

### Movement System
```ts
export class MovementSystem {
  calculateMovementRange(
    unit: Unit,
    map: MapData,
    units: Unit[]
  ): Position[] {
    const range: Position[] = []
    const visited = new Set<string>()
    const queue: { position: Position; cost: number }[] = [
      { position: unit.position, cost: 0 }
    ]

    while (queue.length > 0) {
      const current = queue.shift()!
      const key = `${current.position.x},${current.position.y}`
      
      if (visited.has(key)) continue
      visited.add(key)
      
      if (current.cost <= unit.stats.movement) {
        range.push(current.position)
        
        // Check adjacent tiles
        for (const direction of DIRECTIONS) {
          const nextPos = current.position.add(direction.dx, direction.dy)
          const tile = map.getTile(nextPos)
          
          if (tile && this.canMoveTo(tile, units)) {
            const moveCost = tile.terrain.movementCost
            queue.push({
              position: nextPos,
              cost: current.cost + moveCost
            })
          }
        }
      }
    }

    return range
  }

  private canMoveTo(tile: Tile, units: Unit[]): boolean {
    // Check if tile is walkable and not occupied
    return tile.terrain.walkable && 
           !units.some(u => u.position.equals(tile.position))
  }
}
```

## Testing Patterns

### Entity Testing
```ts
describe('Unit Entity', () => {
  const mockUnit = UnitFactory.createWarrior('unit1', new Position(0, 0))

  test('should take damage correctly', () => {
    const damaged = mockUnit.withDamage(10)
    
    expect(damaged.hp).toBe(30) // 40 - 10
    expect(mockUnit.hp).toBe(40) // Original unchanged
  })

  test('should not go below 0 HP', () => {
    const defeated = mockUnit.withDamage(100)
    
    expect(defeated.hp).toBe(0)
    expect(defeated.isDefeated()).toBe(true)
  })
})
```

### Redux Testing
```ts
describe('Units Slice', () => {
  test('should move unit', () => {
    const initialState = {
      entities: {
        'unit1': { id: 'unit1', position: { x: 0, y: 0 }, stats: mockStats }
      },
      ids: ['unit1']
    }

    const newState = unitsReducer(
      initialState,
      unitMoved({ id: 'unit1', position: new Position(2, 3) })
    )

    expect(newState.entities.unit1.position).toEqual({ x: 2, y: 3 })
  })
})
```

### Hook Testing
```ts
describe('useBattleActions', () => {
  test('should execute move action', async () => {
    const { result } = renderHook(() => useBattleActions(), {
      wrapper: TestProvider
    })

    await act(async () => {
      await result.current.moveUnit('unit1', new Position(3, 4))
    })

    expect(mockExecuteAction).toHaveBeenCalledWith({
      type: 'move',
      unitId: 'unit1',
      position: { x: 3, y: 4 }
    })
  })
})
```

## Performance Optimization

### Memoization
```ts
// Memoize expensive calculations
export const useDamagePreview = (attacker: Unit, defender: Unit) => {
  return useMemo(() => {
    if (!attacker || !defender) return null
    
    const calculator = new BattleCalculator()
    return calculator.calculateDamage({
      attacker,
      defender,
      terrain: getCurrentTerrain(defender.position)
    })
  }, [attacker, defender])
}
```

### React.memo for Game Components
```tsx
export const UnitSprite = React.memo(function UnitSprite({ unit, isSelected }: Props) {
  return (
    <div 
      className={cn(
        "unit-sprite",
        isSelected && "unit-sprite--selected"
      )}
    >
      <img src={unit.sprite} alt={unit.name} />
      <HealthBar current={unit.stats.hp} max={unit.stats.maxHp} />
    </div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison for performance
  return prevProps.unit.id === nextProps.unit.id &&
         prevProps.unit.stats.hp === nextProps.unit.stats.hp &&
         prevProps.isSelected === nextProps.isSelected
})
```

## Constants & Configuration

```ts
// Game constants
export const GAME_CONFIG = {
  GRID_SIZE: 10,
  MAX_UNITS_PER_BATTLE: 12,
  TURN_TIME_LIMIT: 60,
  AUTO_SAVE_INTERVAL: 30000
} as const

// Weapon triangle
export const WEAPON_TRIANGLE = {
  SWORD_VS_AXE: 1.2,
  AXE_VS_LANCE: 1.2,
  LANCE_VS_SWORD: 1.2
} as const

// Terrain types
export const TERRAIN_TYPES = {
  PLAINS: { movementCost: 1, defenseBonus: 0 },
  FOREST: { movementCost: 2, defenseBonus: 1 },
  MOUNTAIN: { movementCost: 3, defenseBonus: 2 },
  WATER: { movementCost: Infinity, defenseBonus: 0 }
} as const
```