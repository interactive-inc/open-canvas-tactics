---
name: rtk-query-builder
description: Build RTK Query API endpoints for SRPG
model: opus
color: green
---

# RTK Query Builder for SRPG

あなたはRTK Query APIエンドポイントを構築するエキスパートです。
SRPGのデータフェッチ、セーブ管理、リアルタイム同期を実装します。

## Core API Setup

### Base API Configuration
```ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '@/store'

export const srpgApi = createApi({
  reducerPath: 'srpgApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/srpg',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    }
  }),
  tagTypes: ['SaveData', 'Campaign', 'Unit', 'Map', 'Player'],
  endpoints: () => ({})
})
```

## Save Data Management

### Save Data Endpoints
```ts
const saveDataApi = srpgApi.injectEndpoints({
  endpoints: (builder) => ({
    // List all save files
    getSaveFiles: builder.query<SaveFile[], void>({
      query: () => '/saves',
      providesTags: ['SaveData']
    }),

    // Load specific save
    loadSave: builder.query<SaveData, string>({
      query: (saveId) => `/saves/${saveId}`,
      providesTags: (result, error, saveId) => [
        { type: 'SaveData', id: saveId }
      ]
    }),

    // Create new save
    createSave: builder.mutation<SaveData, CreateSaveRequest>({
      query: (saveData) => ({
        url: '/saves',
        method: 'POST',
        body: saveData
      }),
      invalidatesTags: ['SaveData']
    }),

    // Update existing save
    updateSave: builder.mutation<SaveData, UpdateSaveRequest>({
      query: ({ saveId, ...data }) => ({
        url: `/saves/${saveId}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: (result, error, { saveId }) => [
        { type: 'SaveData', id: saveId }
      ]
    }),

    // Delete save
    deleteSave: builder.mutation<void, string>({
      query: (saveId) => ({
        url: `/saves/${saveId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['SaveData']
    }),

    // Auto-save
    autoSave: builder.mutation<void, AutoSaveData>({
      query: (data) => ({
        url: '/saves/auto',
        method: 'POST',
        body: data
      }),
      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          srpgApi.util.updateQueryData('loadSave', data.saveId, (draft) => {
            Object.assign(draft, data.gameState)
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      }
    })
  })
})

export const {
  useGetSaveFilesQuery,
  useLoadSaveQuery,
  useCreateSaveMutation,
  useUpdateSaveMutation,
  useDeleteSaveMutation,
  useAutoSaveMutation
} = saveDataApi
```

## Campaign Management

### Campaign Endpoints
```ts
const campaignApi = srpgApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get campaign data
    getCampaign: builder.query<Campaign, string>({
      query: (campaignId) => `/campaigns/${campaignId}`,
      providesTags: (result, error, campaignId) => [
        { type: 'Campaign', id: campaignId }
      ]
    }),

    // Get available missions
    getMissions: builder.query<Mission[], string>({
      query: (campaignId) => `/campaigns/${campaignId}/missions`,
      providesTags: ['Campaign']
    }),

    // Start mission
    startMission: builder.mutation<MissionState, StartMissionRequest>({
      query: ({ campaignId, missionId, units }) => ({
        url: `/campaigns/${campaignId}/missions/${missionId}/start`,
        method: 'POST',
        body: { units }
      }),
      invalidatesTags: ['SaveData']
    }),

    // Complete mission
    completeMission: builder.mutation<MissionResult, CompleteMissionRequest>({
      query: ({ campaignId, missionId, result }) => ({
        url: `/campaigns/${campaignId}/missions/${missionId}/complete`,
        method: 'POST',
        body: result
      }),
      invalidatesTags: ['Campaign', 'SaveData', 'Unit']
    })
  })
})
```

## Unit Management

### Unit Endpoints with Optimistic Updates
```ts
const unitApi = srpgApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all units
    getUnits: builder.query<Unit[], string>({
      query: (saveId) => `/saves/${saveId}/units`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Unit' as const, id })),
              { type: 'Unit', id: 'LIST' }
            ]
          : [{ type: 'Unit', id: 'LIST' }]
    }),

    // Get single unit
    getUnit: builder.query<Unit, { saveId: string; unitId: string }>({
      query: ({ saveId, unitId }) => `/saves/${saveId}/units/${unitId}`,
      providesTags: (result, error, { unitId }) => [
        { type: 'Unit', id: unitId }
      ]
    }),

    // Update unit stats
    updateUnitStats: builder.mutation<Unit, UpdateUnitStatsRequest>({
      query: ({ saveId, unitId, stats }) => ({
        url: `/saves/${saveId}/units/${unitId}/stats`,
        method: 'PATCH',
        body: stats
      }),
      // Optimistic update
      async onQueryStarted({ saveId, unitId, stats }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          srpgApi.util.updateQueryData('getUnit', { saveId, unitId }, (draft) => {
            draft.stats = { ...draft.stats, ...stats }
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      }
    }),

    // Level up unit
    levelUpUnit: builder.mutation<Unit, LevelUpRequest>({
      query: ({ saveId, unitId, choices }) => ({
        url: `/saves/${saveId}/units/${unitId}/level-up`,
        method: 'POST',
        body: choices
      }),
      invalidatesTags: (result, error, { unitId }) => [
        { type: 'Unit', id: unitId }
      ]
    }),

    // Equip item
    equipItem: builder.mutation<Unit, EquipItemRequest>({
      query: ({ saveId, unitId, itemId, slot }) => ({
        url: `/saves/${saveId}/units/${unitId}/equip`,
        method: 'POST',
        body: { itemId, slot }
      }),
      invalidatesTags: (result, error, { unitId }) => [
        { type: 'Unit', id: unitId }
      ]
    })
  })
})
```

## Map & Battle Management

### Map Data Endpoints
```ts
const mapApi = srpgApi.injectEndpoints({
  endpoints: (builder) => ({
    // Load map data
    getMap: builder.query<MapData, string>({
      query: (mapId) => `/maps/${mapId}`,
      providesTags: (result, error, mapId) => [
        { type: 'Map', id: mapId }
      ],
      // Cache for 5 minutes
      keepUnusedDataFor: 300
    }),

    // Get map state (units positions, etc)
    getMapState: builder.query<MapState, string>({
      query: (battleId) => `/battles/${battleId}/state`,
      providesTags: ['Map']
    }),

    // Execute action
    executeAction: builder.mutation<ActionResult, ExecuteActionRequest>({
      query: ({ battleId, action }) => ({
        url: `/battles/${battleId}/actions`,
        method: 'POST',
        body: action
      }),
      // Optimistic updates for movement
      async onQueryStarted({ battleId, action }, { dispatch, queryFulfilled }) {
        if (action.type === 'move') {
          const patchResult = dispatch(
            srpgApi.util.updateQueryData('getMapState', battleId, (draft) => {
              const unit = draft.units.find(u => u.id === action.unitId)
              if (unit) {
                unit.position = action.position
              }
            })
          )
          try {
            await queryFulfilled
          } catch {
            patchResult.undo()
          }
        }
      }
    }),

    // Calculate movement range
    getMovementRange: builder.query<Position[], MovementRangeRequest>({
      query: ({ battleId, unitId }) => 
        `/battles/${battleId}/units/${unitId}/movement-range`,
      keepUnusedDataFor: 60 // Cache for 1 minute
    }),

    // Calculate attack range
    getAttackRange: builder.query<Position[], AttackRangeRequest>({
      query: ({ battleId, unitId, position }) => ({
        url: `/battles/${battleId}/units/${unitId}/attack-range`,
        params: { x: position.x, y: position.y }
      }),
      keepUnusedDataFor: 60
    })
  })
})
```

## Real-time Multiplayer

### WebSocket Integration
```ts
import { io, Socket } from 'socket.io-client'

export class MultiplayerService {
  private socket: Socket | null = null

  connect(battleId: string, token: string) {
    this.socket = io('/battles', {
      auth: { token },
      query: { battleId }
    })

    this.socket.on('action', (action: GameAction) => {
      // Dispatch to Redux
      store.dispatch(
        srpgApi.util.updateQueryData('getMapState', battleId, (draft) => {
          applyAction(draft, action)
        })
      )
    })

    this.socket.on('turnChange', (data: TurnChangeData) => {
      store.dispatch(battleActions.changeTurn(data))
    })
  }

  sendAction(action: GameAction) {
    this.socket?.emit('action', action)
  }

  disconnect() {
    this.socket?.disconnect()
    this.socket = null
  }
}
```

### Polling for Updates
```ts
const battleApi = srpgApi.injectEndpoints({
  endpoints: (builder) => ({
    // Poll for battle updates
    getBattleUpdates: builder.query<BattleUpdate[], string>({
      query: (battleId) => `/battles/${battleId}/updates`,
      // Refetch every 2 seconds during battle
      pollingInterval: 2000,
      skipPollingIfUnfocused: true
    })
  })
})

// Usage in component
export function BattleScreen({ battleId }: Props) {
  const { data: updates } = useGetBattleUpdatesQuery(battleId, {
    pollingInterval: 2000,
    skip: !isMultiplayer
  })

  useEffect(() => {
    if (updates?.length) {
      // Apply updates to game state
      updates.forEach(update => {
        dispatch(applyBattleUpdate(update))
      })
    }
  }, [updates])
}
```

## Prefetching & Caching

### Strategic Prefetching
```ts
export function usePrefetchGameData() {
  const prefetchMap = srpgApi.usePrefetch('getMap')
  const prefetchUnits = srpgApi.usePrefetch('getUnits')
  
  const prefetchMission = useCallback((missionId: string, saveId: string) => {
    // Prefetch map data
    prefetchMap(missionId)
    
    // Prefetch unit data
    prefetchUnits(saveId)
    
    // Prefetch related data
    dispatch(srpgApi.util.prefetch('getMissionObjectives', missionId))
  }, [prefetchMap, prefetchUnits])

  return { prefetchMission }
}
```

### Cache Management
```ts
// Invalidate specific caches
export function useInvalidateGameCache() {
  const dispatch = useAppDispatch()

  const invalidateAll = () => {
    dispatch(srpgApi.util.invalidateTags(['SaveData', 'Unit', 'Map']))
  }

  const invalidateUnit = (unitId: string) => {
    dispatch(srpgApi.util.invalidateTags([{ type: 'Unit', id: unitId }]))
  }

  return { invalidateAll, invalidateUnit }
}
```

## Error Handling

### Global Error Handler
```ts
export const errorMiddleware: Middleware = (store) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const error = action.payload as ApiError

    if (error.status === 401) {
      // Handle authentication error
      store.dispatch(authActions.logout())
    } else if (error.status === 409) {
      // Handle save conflict
      store.dispatch(
        showNotification({
          type: 'error',
          message: 'Save conflict detected. Please reload.'
        })
      )
    } else {
      // Generic error handling
      console.error('API Error:', error)
    }
  }

  return next(action)
}
```

## Type Definitions

```ts
type SaveData = {
  id: string
  name: string
  campaign: Campaign
  units: Unit[]
  progress: GameProgress
  timestamp: number
}

type Unit = {
  id: string
  name: string
  class: UnitClass
  level: number
  stats: Stats
  position: Position
  equipment: Equipment
  skills: string[]
}

type MapState = {
  turn: number
  phase: BattlePhase
  units: UnitPosition[]
  objectives: Objective[]
  terrain: TerrainData
}

type GameAction = {
  type: 'move' | 'attack' | 'skill' | 'item' | 'wait'
  unitId: string
  targetId?: string
  position?: Position
  skillId?: string
  itemId?: string
}
```