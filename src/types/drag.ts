export const DRAG_TYPE_CARD = "card" as const
export const DRAG_TYPE_COLUMN = "column" as const
export const DRAG_TYPE_CALENDAR_SLOT = "calendar-slot" as const

export interface CardDragData {
  [key: string]: unknown
  type: typeof DRAG_TYPE_CARD
  cardId: string
  columnId: string
}

export interface ColumnDragData {
  [key: string]: unknown
  type: typeof DRAG_TYPE_COLUMN
  columnId: string
}

export interface CalendarSlotData {
  [key: string]: unknown
  type: typeof DRAG_TYPE_CALENDAR_SLOT
  timeSlot: string
  date: string
}

export type DragData = CardDragData | ColumnDragData | CalendarSlotData
