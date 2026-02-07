import type { BoardState } from "./board"

export type BoardAction =
  | { type: "ADD_COLUMN"; title: string }
  | { type: "RENAME_COLUMN"; columnId: string; title: string }
  | { type: "DELETE_COLUMN"; columnId: string }
  | { type: "ADD_CARD"; columnId: string; title: string }
  | { type: "UPDATE_CARD"; cardId: string; title: string; description: string }
  | { type: "DELETE_CARD"; cardId: string; columnId: string }
  | { type: "REORDER_CARD"; columnId: string; cardId: string; targetIndex: number }
  | { type: "MOVE_CARD"; sourceColumnId: string; targetColumnId: string; cardId: string; targetIndex: number }
  | { type: "REORDER_COLUMN"; columnId: string; targetIndex: number }
  | { type: "ADD_CALENDAR_ENTRY"; cardId: string; date: string; timeSlot: string }
  | { type: "REMOVE_CALENDAR_ENTRY"; entryId: string }
  | { type: "RESIZE_CALENDAR_ENTRY"; entryId: string; durationSlots: number }
  | { type: "LOAD_STATE"; state: BoardState }
