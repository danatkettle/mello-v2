import { createContext, useContext, useReducer, useEffect, useState, useRef, type ReactNode } from "react"
import type { BoardState } from "@/types/board"
import type { BoardAction } from "@/types/actions"
import { boardReducer } from "./board-reducer"
import { DEFAULT_BOARD_STATE } from "./board-defaults"
import { fetchBoardState, saveBoardState, deleteBoardState } from "./board-api"
import { debounce } from "./debounce"

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

interface BoardContextValue {
  state: BoardState
  dispatch: React.Dispatch<BoardAction>
  resetBoard: () => void
  isLoading: boolean
  saveError: string | null
  forceSyncBoard: () => Promise<void>
}

const BoardContext = createContext<BoardContextValue | null>(null)

export function BoardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(boardReducer, DEFAULT_BOARD_STATE)
  const [isLoading, setIsLoading] = useState(true)
  const [saveError, setSaveError] = useState<string | null>(null)
  const isMountedRef = useRef(false)

  useEffect(() => {
    async function loadBoard() {
      try {
        const data = await fetchBoardState()
        if (data) {
          dispatch({ type: "RESET_BOARD", payload: normalizeState(data) })
        }
      } catch (error) {
        console.error("Failed to load board:", error)
        setSaveError(error instanceof Error ? error.message : "Failed to load board")
      } finally {
        setIsLoading(false)
        isMountedRef.current = true
      }
    }
    loadBoard()
  }, [])

  const debouncedSave = useRef(
    debounce(async (currentState: BoardState) => {
      try {
        await saveBoardState(currentState)
        setSaveError(null)
      } catch (error) {
        console.error("Failed to save board:", error)
        setSaveError(error instanceof Error ? error.message : "Failed to save board")
      }
    }, 500)
  ).current

  useEffect(() => {
    if (isMountedRef.current) {
      debouncedSave(state)
    }
  }, [state, debouncedSave])

  const resetBoard = async () => {
    try {
      await deleteBoardState()
      dispatch({ type: "RESET_BOARD" })
      await saveBoardState(DEFAULT_BOARD_STATE)
      setSaveError(null)
    } catch (error) {
      console.error("Failed to reset board:", error)
      setSaveError(error instanceof Error ? error.message : "Failed to reset board")
    }
  }

  const forceSyncBoard = async () => {
    try {
      await saveBoardState(state)
      setSaveError(null)
    } catch (error) {
      console.error("Failed to sync board:", error)
      setSaveError(error instanceof Error ? error.message : "Failed to sync board")
      throw error
    }
  }

  return (
    <BoardContext.Provider value={{ state, dispatch, resetBoard, isLoading, saveError, forceSyncBoard }}>
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
