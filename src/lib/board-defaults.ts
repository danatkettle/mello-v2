import type { BoardState } from "@/types/board"

export function generateId(): string {
  return crypto.randomUUID()
}

export const DEFAULT_BOARD_STATE: BoardState = (() => {
  const card1 = generateId()
  const card2 = generateId()
  const card3 = generateId()
  const card4 = generateId()
  const card5 = generateId()

  const col1 = generateId()
  const col2 = generateId()
  const col3 = generateId()

  return {
    cards: {
      [card1]: { id: card1, title: "Research project requirements", description: "", createdAt: new Date().toISOString() },
      [card2]: { id: card2, title: "Set up development environment", description: "", createdAt: new Date().toISOString() },
      [card3]: { id: card3, title: "Design database schema", description: "Define tables and relationships", createdAt: new Date().toISOString() },
      [card4]: { id: card4, title: "Build API endpoints", description: "", createdAt: new Date().toISOString() },
      [card5]: { id: card5, title: "Write unit tests", description: "", createdAt: new Date().toISOString() },
    },
    columns: {
      [col1]: { id: col1, title: "To Do", cardIds: [card1, card2] },
      [col2]: { id: col2, title: "In Progress", cardIds: [card3, card4] },
      [col3]: { id: col3, title: "Done", cardIds: [card5] },
    },
    columnOrder: [col1, col2, col3],
    calendarEntries: {},
  }
})()
