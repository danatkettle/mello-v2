import { useRef, useEffect, useState } from "react"
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import invariant from "tiny-invariant"
import { DRAG_TYPE_CARD, DRAG_TYPE_CALENDAR_SLOT } from "@/types/drag"
import { cn } from "@/lib/utils"

interface TimeSlotProps {
  timeSlot: string
  date: string
}

export function TimeSlot({ timeSlot, date }: TimeSlotProps) {
  const slotRef = useRef<HTMLDivElement>(null)
  const [isDraggedOver, setIsDraggedOver] = useState(false)

  useEffect(() => {
    const el = slotRef.current
    invariant(el)

    const cleanup = dropTargetForElements({
      element: el,
      getData: () => ({ type: DRAG_TYPE_CALENDAR_SLOT, timeSlot, date }),
      canDrop: ({ source }) => source.data.type === DRAG_TYPE_CARD,
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
    })

    return cleanup
  }, [timeSlot, date])

  return (
    <div
      ref={slotRef}
      className={cn(
        "relative border-b transition-colors",
        isDraggedOver && "bg-primary/5"
      )}
      style={{ height: "var(--slot-row-height)" }}
    />
  )
}
