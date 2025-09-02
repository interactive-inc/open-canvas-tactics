import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Theme = 'light' | 'dark'

interface UIState {
  theme: Theme
  sidebarOpen: boolean
  modalOpen: boolean
}

const initialState: UIState = {
  theme: 'light',
  sidebarOpen: true,
  modalOpen: false,
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setModalOpen: (state, action: PayloadAction<boolean>) => {
      state.modalOpen = action.payload
    },
  },
})

export const { setTheme, toggleTheme, setSidebarOpen, toggleSidebar, setModalOpen } = uiSlice.actions

export default uiSlice.reducer