import type { BoardState } from "@/types/board"
import type { BoardAction } from "@/types/actions"
import { generateId } from "./board-defaults"

export function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "ADD_COLUMN": {
      const id = generateId()
      return {
        ...state,
        columns: {
          ...state.columns,
          [id]: { id, title: action.title, cardIds: [] },
        },
        columnOrder: [...state.columnOrder, id],
      }
    }

    case "RENAME_COLUMN": {
      const column = state.columns[action.columnId]
      if (!column) return state
      return {
        ...state,
        columns: {
          ...state.columns,
          [action.columnId]: { ...column, title: action.title },
        },
      }
    }

    case "DELETE_COLUMN": {
      const column = state.columns[action.columnId]
      if (!column) return state

      const newCards = { ...state.cards }
      const newCalendarEntries = { ...state.calendarEntries }

      // Remove all cards in this column and their calendar entries
      for (const cardId of column.cardIds) {
        delete newCards[cardId]
        for (const [entryId, entry] of Object.entries(newCalendarEntries)) {
          if (entry.cardId === cardId) {
            delete newCalendarEntries[entryId]
          }
        }
      }

      const { [action.columnId]: _, ...newColumns } = state.columns
      return {
        ...state,
        cards: newCards,
        columns: newColumns,
        columnOrder: state.columnOrder.filter((id) => id !== action.columnId),
        calendarEntries: newCalendarEntries,
      }
    }

    case "ADD_CARD": {
      const column = state.columns[action.columnId]
      if (!column) return state

      const id = generateId()
      return {
        ...state,
        cards: {
          ...state.cards,
          [id]: { id, title: action.title, description: "", createdAt: new Date().toISOString() },
        },
        columns: {
          ...state.columns,
          [action.columnId]: {
            ...column,
            cardIds: [...column.cardIds, id],
          },
        },
      }
    }

    case "UPDATE_CARD": {
      const card = state.cards[action.cardId]
      if (!card) return state
      return {
        ...state,
        cards: {
          ...state.cards,
          [action.cardId]: { ...card, title: action.title, description: action.description },
        },
      }
    }

    case "DELETE_CARD": {
      const column = state.columns[action.columnId]
      if (!column) return state

      const { [action.cardId]: _, ...newCards } = state.cards
      const newCalendarEntries = { ...state.calendarEntries }

      // Remove calendar entries for this card
      for (const [entryId, entry] of Object.entries(newCalendarEntries)) {
        if (entry.cardId === action.cardId) {
          delete newCalendarEntries[entryId]
        }
      }

      return {
        ...state,
        cards: newCards,
        columns: {
          ...state.columns,
          [action.columnId]: {
            ...column,
            cardIds: column.cardIds.filter((id) => id !== action.cardId),
          },
        },
        calendarEntries: newCalendarEntries,
      }
    }

    case "REORDER_CARD": {
      const column = state.columns[action.columnId]
      if (!column) return state

      const currentIndex = column.cardIds.indexOf(action.cardId)
      if (currentIndex === -1) return state

      const newCardIds = [...column.cardIds]
      newCardIds.splice(currentIndex, 1)
      newCardIds.splice(action.targetIndex, 0, action.cardId)

      return {
        ...state,
        columns: {
          ...state.columns,
          [action.columnId]: { ...column, cardIds: newCardIds },
        },
      }
    }

    case "MOVE_CARD": {
      const sourceColumn = state.columns[action.sourceColumnId]
      const targetColumn = state.columns[action.targetColumnId]
      if (!sourceColumn || !targetColumn) return state

      const newSourceCardIds = sourceColumn.cardIds.filter((id) => id !== action.cardId)
      const newTargetCardIds = [...targetColumn.cardIds]
      newTargetCardIds.splice(action.targetIndex, 0, action.cardId)

      return {
        ...state,
        columns: {
          ...state.columns,
          [action.sourceColumnId]: { ...sourceColumn, cardIds: newSourceCardIds },
          [action.targetColumnId]: { ...targetColumn, cardIds: newTargetCardIds },
        },
      }
    }

    case "REORDER_COLUMN": {
      const currentIndex = state.columnOrder.indexOf(action.columnId)
      if (currentIndex === -1) return state

      const newOrder = [...state.columnOrder]
      newOrder.splice(currentIndex, 1)
      newOrder.splice(action.targetIndex, 0, action.columnId)

      return {
        ...state,
        columnOrder: newOrder,
      }
    }

    case "ADD_CALENDAR_ENTRY": {
      // Prevent duplicate: same card + same date + same timeSlot
      const duplicate = Object.values(state.calendarEntries).find(
        (e) => e.cardId === action.cardId && e.date === action.date && e.timeSlot === action.timeSlot
      )
      if (duplicate) return state

      const id = generateId()
      return {
        ...state,
        calendarEntries: {
          ...state.calendarEntries,
          [id]: { id, cardId: action.cardId, date: action.date, timeSlot: action.timeSlot, durationSlots: 1 },
        },
      }
    }

    case "REMOVE_CALENDAR_ENTRY": {
      const { [action.entryId]: _, ...newEntries } = state.calendarEntries
      return {
        ...state,
        calendarEntries: newEntries,
      }
    }

    case "RESIZE_CALENDAR_ENTRY": {
      const entry = state.calendarEntries[action.entryId]
      if (!entry) return state
      const nextDuration = Math.max(1, action.durationSlots)
      if (entry.durationSlots === nextDuration) return state
      return {
        ...state,
        calendarEntries: {
          ...state.calendarEntries,
          [action.entryId]: { ...entry, durationSlots: nextDuration },
        },
      }
    }

    case "LOAD_STATE": {
      return action.state
    }

    default:
      return state
  }
}
