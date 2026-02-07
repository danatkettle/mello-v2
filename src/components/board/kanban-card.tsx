import { useState, useRef, useEffect, useCallback } from "react"
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { attachClosestEdge, extractClosestEdge, type Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"
import invariant from "tiny-invariant"
import type { Card } from "@/types/board"
import { DRAG_TYPE_CARD, type CardDragData } from "@/types/drag"
import { cn } from "@/lib/utils"
import { CardDialog } from "./card-dialog"

interface KanbanCardProps {
  card: Card
  columnId: string
}

export function KanbanCard({ card, columnId }: KanbanCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = cardRef.current
    invariant(el)

    const dragData: CardDragData = { type: DRAG_TYPE_CARD, cardId: card.id, columnId }

    const cleanupDrag = draggable({
      element: el,
      getInitialData: () => dragData,
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    })

    const cleanupDrop = dropTargetForElements({
      element: el,
      getData: ({ input, element }) => {
        return attachClosestEdge({ ...dragData }, { input, element, allowedEdges: ["top", "bottom"] })
      },
      getIsSticky: () => true,
      onDragEnter: ({ self }) => {
        setClosestEdge(extractClosestEdge(self.data))
      },
      onDrag: ({ self }) => {
        setClosestEdge(extractClosestEdge(self.data))
      },
      onDragLeave: () => setClosestEdge(null),
      onDrop: () => setClosestEdge(null),
    })

    return () => {
      cleanupDrag()
      cleanupDrop()
    }
  }, [card.id, columnId])

  const handleClick = useCallback(() => {
    if (!isDragging) setDialogOpen(true)
  }, [isDragging])

  return (
    <>
      <div
        ref={cardRef}
        className={cn(
          "group relative rounded-lg border bg-card p-3 shadow-sm transition-colors hover:border-ring/50 cursor-pointer",
          isDragging && "opacity-50"
        )}
        onClick={handleClick}
      >
        {closestEdge === "top" && (
          <div className="absolute -top-[2px] left-0 right-0 h-[2px] rounded-full bg-primary" />
        )}
        <p className="text-sm">{card.title}</p>
        {card.description && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{card.description}</p>
        )}
        {closestEdge === "bottom" && (
          <div className="absolute -bottom-[2px] left-0 right-0 h-[2px] rounded-full bg-primary" />
        )}
      </div>
      <CardDialog
        card={card}
        columnId={columnId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}
