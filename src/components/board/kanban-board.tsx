import { Columns3, Sparkles } from "lucide-react"
import { useBoard } from "@/lib/board-context"
import { BoardColumn } from "./board-column"
import { AddColumnButton } from "./add-column-button"

export function KanbanBoard() {
  const { state } = useBoard()

  const hasColumns = state.columnOrder.length > 0

  if (!hasColumns) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="flex flex-col items-center text-center max-w-md">
          <div className="mb-4 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 p-6">
            <Columns3 className="size-12 text-primary" />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">
            Welcome to Mello
          </h2>
          <p className="text-muted-foreground/80 leading-relaxed mb-6">
            Start organizing your work by creating your first column.
            Common columns include <span className="font-medium text-foreground">To Do</span>,
            <span className="font-medium text-foreground"> In Progress</span>, and
            <span className="font-medium text-foreground"> Done</span>.
          </p>
          <div className="flex items-center gap-2 text-sm text-primary/80">
            <Sparkles className="size-4" />
            <span className="font-medium">Click below to get started</span>
          </div>
          <div className="mt-6">
            <AddColumnButton />
          </div>
        </div>
      </div>
    )
  }

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
