import { useRef, useEffect, useState } from "react"
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { attachClosestEdge, extractClosestEdge, type Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"
import invariant from "tiny-invariant"
import type { Column, Card } from "@/types/board"
import { DRAG_TYPE_COLUMN, type ColumnDragData } from "@/types/drag"
import { cn } from "@/lib/utils"
import { ColumnHeader } from "./column-header"
import { CardList } from "./card-list"
import { AddCardForm } from "./add-card-form"

interface BoardColumnProps {
  column: Column
  cards: Card[]
}

export function BoardColumn({ column, cards }: BoardColumnProps) {
  const columnRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null)

  useEffect(() => {
    const el = columnRef.current
    const handle = headerRef.current
    invariant(el)
    invariant(handle)

    const dragData: ColumnDragData = { type: DRAG_TYPE_COLUMN, columnId: column.id }

    const cleanupDrag = draggable({
      element: el,
      dragHandle: handle,
      getInitialData: () => dragData,
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    })

    const cleanupDrop = dropTargetForElements({
      element: el,
      getData: ({ input, element }) => {
        return attachClosestEdge({ ...dragData }, { input, element, allowedEdges: ["left", "right"] })
      },
      canDrop: ({ source }) => source.data.type === DRAG_TYPE_COLUMN,
      getIsSticky: () => true,
      onDragEnter: ({ self }) => setClosestEdge(extractClosestEdge(self.data)),
      onDrag: ({ self }) => setClosestEdge(extractClosestEdge(self.data)),
      onDragLeave: () => setClosestEdge(null),
      onDrop: () => setClosestEdge(null),
    })

    return () => {
      cleanupDrag()
      cleanupDrop()
    }
  }, [column.id])

  return (
    <div className="relative flex shrink-0">
      {closestEdge === "left" && (
        <div className="absolute -left-[2px] top-0 bottom-0 w-[2px] rounded-full bg-primary" />
      )}
      <div
        ref={columnRef}
        className={cn(
          "flex w-72 shrink-0 flex-col rounded-xl border bg-muted/50",
          isDragging && "opacity-50"
        )}
      >
        <ColumnHeader columnId={column.id} title={column.title} dragHandleRef={headerRef} />
        <CardList cards={cards} columnId={column.id} />
        <div className="p-2">
          <AddCardForm columnId={column.id} />
        </div>
      </div>
      {closestEdge === "right" && (
        <div className="absolute -right-[2px] top-0 bottom-0 w-[2px] rounded-full bg-primary" />
      )}
    </div>
  )
}
