import { useCallback, useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useBoard } from "@/lib/board-context"
import { cn } from "@/lib/utils"

interface CalendarCardChipProps {
  entryId: string
  cardTitle: string
  showTitle?: boolean
  showRemove?: boolean
  durationSlots?: number
  maxDurationSlots?: number
  onResize?: (durationSlots: number) => void
  className?: string
  style?: React.CSSProperties
}

export function CalendarCardChip({
  entryId,
  cardTitle,
  showTitle = true,
  showRemove = true,
  durationSlots = 1,
  maxDurationSlots = 1,
  onResize,
  className,
  style,
}: CalendarCardChipProps) {
  const { dispatch } = useBoard()
  const [isResizing, setIsResizing] = useState(false)
  const resizeRef = useRef<{
    startY: number
    startDuration: number
    rowHeight: number
    maxDuration: number
    lastDuration: number
  } | null>(null)

  const handlePointerMove = useCallback((event: PointerEvent) => {
    const state = resizeRef.current
    if (!state || !onResize) return
    const deltaSlots = Math.round((event.clientY - state.startY) / state.rowHeight)
    const nextDuration = Math.min(
      state.maxDuration,
      Math.max(1, state.startDuration + deltaSlots)
    )
    if (nextDuration !== state.lastDuration) {
      state.lastDuration = nextDuration
      onResize(nextDuration)
    }
  }, [onResize])

  const handlePointerUp = useCallback(() => {
    resizeRef.current = null
    setIsResizing(false)
  }, [])

  useEffect(() => {
    if (!isResizing) return
    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", handlePointerUp)
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [handlePointerMove, handlePointerUp, isResizing])

  const handleResizeStart = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!onResize) return
      event.preventDefault()
      event.stopPropagation()
      const grid = event.currentTarget.closest("[data-slot-grid='true']") as HTMLElement | null
      const rowHeightValue = grid
        ? getComputedStyle(grid).getPropertyValue("--slot-row-height")
        : ""
      const rowHeight = parseFloat(rowHeightValue) || 0
      if (!rowHeight) return
      const startDuration = Math.max(1, durationSlots)
      resizeRef.current = {
        startY: event.clientY,
        startDuration,
        rowHeight,
        maxDuration: Math.max(1, maxDurationSlots),
        lastDuration: startDuration,
      }
      setIsResizing(true)
      event.currentTarget.setPointerCapture(event.pointerId)
    },
    [durationSlots, maxDurationSlots, onResize]
  )

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col gap-1 rounded-lg border border-primary/40 bg-gradient-to-br from-primary/15 to-primary/10 px-2.5 py-1.5 text-xs shadow-[0_2px_8px_rgba(59,130,246,0.12)]",
        isResizing && "ring-2 ring-primary/50 shadow-[0_4px_12px_rgba(59,130,246,0.2)]",
        className
      )}
      style={style}
    >
      {showTitle ? <span className="truncate font-medium leading-relaxed">{cardTitle}</span> : null}
      {showRemove && (
        <Button
          variant="ghost"
          size="icon-xs"
          className="absolute right-1 top-1 size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-primary/20"
          onClick={(e) => {
            e.stopPropagation()
            dispatch({ type: "REMOVE_CALENDAR_ENTRY", entryId })
          }}
        >
          <X className="size-3" />
        </Button>
      )}
      <div
        role="separator"
        aria-orientation="horizontal"
        className="absolute left-1 right-1 -bottom-1 h-2 cursor-ns-resize rounded-md opacity-0 transition-opacity hover:bg-primary/30 group-hover:opacity-100"
        onPointerDown={handleResizeStart}
      />
    </div>
  )
}
