import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import type { BoardState } from "@/types/board"
import type { BoardAction } from "@/types/actions"
import { boardReducer } from "./board-reducer"
import { DEFAULT_BOARD_STATE } from "./board-defaults"

const STORAGE_KEY = "mello-v2-board"

function normalizeState(state: BoardState): BoardState {
  const normalizedEntries: BoardState["calendarEntries"] = {}
  for (const [entryId, entry] of Object.entries(state.calendarEntries ?? {})) {
    normalizedEntries[entryId] = {
      ...entry,
      durationSlots: Math.max(1, entry.durationSlots ?? 1),
    }
  }
  return { ...state, calendarEntries: normalizedEntries }
}

function getInitialState(): BoardState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return normalizeState(JSON.parse(stored) as BoardState)
    }
  } catch {
    // ignore parse errors
  }
  return DEFAULT_BOARD_STATE
}

interface BoardContextValue {
  state: BoardState
  dispatch: React.Dispatch<BoardAction>
}

const BoardContext = createContext<BoardContextValue | null>(null)

export function BoardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(boardReducer, null, getInitialState)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // localStorage full or unavailable
    }
  }, [state])

  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  )
}

export function useBoard(): BoardContextValue {
  const context = useContext(BoardContext)
  if (!context) {
    throw new Error("useBoard must be used within a BoardProvider")
  }
  return context
}
