import { useBoard } from "@/lib/board-context"
import { BoardColumn } from "./board-column"
import { AddColumnButton } from "./add-column-button"

export function KanbanBoard() {
  const { state } = useBoard()

  return (
    <div className="flex flex-1 gap-4 overflow-x-auto p-4">
      {state.columnOrder.map((columnId) => {
        const column = state.columns[columnId]
        if (!column) return null
        const cards = column.cardIds
          .map((cardId) => state.cards[cardId])
          .filter(Boolean)
        return <BoardColumn key={column.id} column={column} cards={cards} />
      })}
      <AddColumnButton />
    </div>
  )
}
