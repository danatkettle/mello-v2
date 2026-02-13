import { useRef, useEffect, useState } from "react"
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { Inbox } from "lucide-react"
import invariant from "tiny-invariant"
import type { Card } from "@/types/board"
import { DRAG_TYPE_CARD } from "@/types/drag"
import { cn } from "@/lib/utils"
import { KanbanCard } from "./kanban-card"

interface CardListProps {
  cards: Card[]
  columnId: string
}

export function CardList({ cards, columnId }: CardListProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const [isDraggedOver, setIsDraggedOver] = useState(false)

  useEffect(() => {
    const el = listRef.current
    invariant(el)

    const cleanup = dropTargetForElements({
      element: el,
      getData: () => ({ columnId }),
      canDrop: ({ source }) => source.data.type === DRAG_TYPE_CARD,
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
    })

    return cleanup
  }, [columnId])

  return (
    <div
      ref={listRef}
      className={cn(
        "flex min-h-[40px] flex-1 flex-col gap-2 px-3 py-2 pb-3 transition-colors",
        isDraggedOver && cards.length === 0 && "bg-muted/50 rounded-lg"
      )}
    >
      {cards.map((card) => (
        <KanbanCard key={card.id} card={card} columnId={columnId} />
      ))}
      {cards.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
          <div className="mb-3 rounded-full bg-primary/10 p-3">
            <Inbox className="size-6 text-primary/60" />
          </div>
          <p className="text-sm font-medium text-foreground/70 mb-1">No cards yet</p>
          <p className="text-xs text-muted-foreground/80 leading-relaxed">
            Drag cards here or click <span className="font-medium text-primary">+ Add a card</span> below
          </p>
        </div>
      )}
    </div>
  )
}
