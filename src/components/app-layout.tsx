import { useState, useEffect, useRef, useCallback } from "react"
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"
import { DRAG_TYPE_CARD, DRAG_TYPE_COLUMN, DRAG_TYPE_CALENDAR_SLOT } from "@/types/drag"
import type { BoardState } from "@/types/board"
import type { BoardAction } from "@/types/actions"
import { useBoard } from "@/lib/board-context"
import { Header } from "./header"
import { KanbanBoard } from "./board/kanban-board"
import { PlannerPanel } from "./planner/planner-panel"

function handleDrop(
  state: BoardState,
  dispatch: React.Dispatch<BoardAction>,
  source: Record<string | symbol, unknown>,
  targetData: Record<string | symbol, unknown>,
) {
  const sourceData = source

  // Card drag
  if (sourceData.type === DRAG_TYPE_CARD) {
    const sourceCardId = sourceData.cardId as string
    const sourceColumnId = sourceData.columnId as string

    // Card → calendar slot
    if (targetData.type === DRAG_TYPE_CALENDAR_SLOT) {
      dispatch({
        type: "ADD_CALENDAR_ENTRY",
        cardId: sourceCardId,
        date: targetData.date as string,
        timeSlot: targetData.timeSlot as string,
      })
      return
    }

    // Card → card (reorder or cross-column move)
    if (targetData.type === DRAG_TYPE_CARD) {
      const targetCardId = targetData.cardId as string
      const targetColumnId = targetData.columnId as string
      const closestEdge = extractClosestEdge(targetData)

      const targetColumn = state.columns[targetColumnId]
      if (!targetColumn) return

      const targetCardIndex = targetColumn.cardIds.indexOf(targetCardId)
      if (targetCardIndex === -1) return

      const targetIndex = closestEdge === "bottom" ? targetCardIndex + 1 : targetCardIndex

      if (sourceColumnId === targetColumnId) {
        const currentIndex = targetColumn.cardIds.indexOf(sourceCardId)
        const adjustedIndex = currentIndex < targetIndex ? targetIndex - 1 : targetIndex
        dispatch({
          type: "REORDER_CARD",
          columnId: sourceColumnId,
          cardId: sourceCardId,
          targetIndex: adjustedIndex,
        })
      } else {
        dispatch({
          type: "MOVE_CARD",
          sourceColumnId,
          targetColumnId,
          cardId: sourceCardId,
          targetIndex,
        })
      }
      return
    }

    // Card → empty column (drop on card-list container)
    if (targetData.columnId && !targetData.type) {
      const targetColumnId = targetData.columnId as string
      if (sourceColumnId === targetColumnId) return

      dispatch({
        type: "MOVE_CARD",
        sourceColumnId,
        targetColumnId,
        cardId: sourceCardId,
        targetIndex: state.columns[targetColumnId]?.cardIds.length ?? 0,
      })
      return
    }
  }

  // Column drag
  if (sourceData.type === DRAG_TYPE_COLUMN && targetData.type === DRAG_TYPE_COLUMN) {
    const sourceColumnId = sourceData.columnId as string
    const targetColumnId = targetData.columnId as string
    if (sourceColumnId === targetColumnId) return

    const closestEdge = extractClosestEdge(targetData)
    const sourceIndex = state.columnOrder.indexOf(sourceColumnId)

    const newOrder = [...state.columnOrder]
    newOrder.splice(sourceIndex, 1)
    const insertAt = closestEdge === "right"
      ? newOrder.indexOf(targetColumnId) + 1
      : newOrder.indexOf(targetColumnId)

    dispatch({
      type: "REORDER_COLUMN",
      columnId: sourceColumnId,
      targetIndex: insertAt,
    })
  }
}

export function AppLayout() {
  const { state, dispatch } = useBoard()
  const [isPlannerOpen, setIsPlannerOpen] = useState(false)
  const stateRef = useRef(state)
  stateRef.current = state

  const togglePlanner = useCallback(() => {
    setIsPlannerOpen((prev) => !prev)
  }, [])

  const closePlanner = useCallback(() => {
    setIsPlannerOpen(false)
  }, [])

  useEffect(() => {
    return monitorForElements({
      onDrop: ({ source, location }) => {
        const target = location.current.dropTargets[0]
        if (!target) return
        handleDrop(stateRef.current, dispatch, source.data, target.data)
      },
    })
  }, [dispatch])

  return (
    <div className="flex h-svh flex-col">
      <Header isPlannerOpen={isPlannerOpen} onTogglePlanner={togglePlanner} />
      <div className="flex flex-1 overflow-hidden">
        <KanbanBoard />
        <PlannerPanel isOpen={isPlannerOpen} onClose={closePlanner} />
      </div>
    </div>
  )
}
