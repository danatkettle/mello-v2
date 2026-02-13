export interface Card {
  id: string
  title: string
  description: string
  createdAt: string
}

export interface Column {
  id: string
  title: string
  cardIds: string[]
  wipLimit?: number
}

export interface CalendarEntry {
  id: string
  cardId: string
  date: string // YYYY-MM-DD
  timeSlot: string // HH:mm
  durationSlots: number
}

export interface BoardState {
  cards: Record<string, Card>
  columns: Record<string, Column>
  columnOrder: string[]
  calendarEntries: Record<string, CalendarEntry>
}
