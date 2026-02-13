import { useState, useRef, useEffect } from "react"
import { MoreHorizontal, Pencil, Trash2, ListChecks, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useBoard } from "@/lib/board-context"
import { WipLimitDialog } from "./wip-limit-dialog"
import { cn } from "@/lib/utils"

interface ColumnHeaderProps {
  columnId: string
  title: string
  cardCount: number
  wipLimit?: number
  dragHandleRef: React.RefObject<HTMLDivElement | null>
}

export function ColumnHeader({ columnId, title, cardCount, wipLimit, dragHandleRef }: ColumnHeaderProps) {
  const { dispatch } = useBoard()
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(title)
  const [showLimitDialog, setShowLimitDialog] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  const handleSubmit = () => {
    const trimmed = editTitle.trim()
    if (trimmed && trimmed !== title) {
      dispatch({ type: "RENAME_COLUMN", columnId, title: trimmed })
    } else {
      setEditTitle(title)
    }
    setIsEditing(false)
  }

  const handleDelete = () => {
    dispatch({ type: "DELETE_COLUMN", columnId })
  }

  const isOverLimit = wipLimit !== undefined && cardCount > wipLimit
  const isAtLimit = wipLimit !== undefined && cardCount === wipLimit
  const isNearLimit = wipLimit !== undefined && cardCount === wipLimit - 1

  return (
    <div
      ref={dragHandleRef}
      className="flex items-center justify-between px-4 py-3 cursor-grab active:cursor-grabbing border-b border-border/40"
    >
      {isEditing ? (
        <Input
          ref={inputRef}
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit()
            if (e.key === "Escape") {
              setEditTitle(title)
              setIsEditing(false)
            }
          }}
          className="h-8 font-serif text-base font-semibold"
        />
      ) : (
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <h3 className="truncate font-serif text-base font-semibold px-1">{title}</h3>
          {wipLimit !== undefined && (
            <Badge
              variant={isOverLimit ? "destructive" : isAtLimit ? "outline" : "secondary"}
              className={cn(
                "text-xs tabular-nums shrink-0",
                isOverLimit && "animate-pulse",
                isNearLimit && !isAtLimit && "border-amber-400 bg-amber-50 text-amber-900"
              )}
            >
              {isOverLimit && <AlertCircle className="size-3 mr-1" />}
              {cardCount}/{wipLimit}
            </Badge>
          )}
        </div>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-xs" className="shrink-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditing(true)}>
            <Pencil className="size-4" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowLimitDialog(true)}>
            <ListChecks className="size-4" />
            {wipLimit !== undefined ? "Edit WIP limit" : "Set WIP limit"}
          </DropdownMenuItem>
          {wipLimit !== undefined && (
            <DropdownMenuItem onClick={() => dispatch({ type: "REMOVE_WIP_LIMIT", columnId })}>
              <XCircle className="size-4" />
              Remove WIP limit
            </DropdownMenuItem>
          )}
          <DropdownMenuItem variant="destructive" onClick={handleDelete}>
            <Trash2 className="size-4" />
            Delete column
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <WipLimitDialog
        open={showLimitDialog}
        onOpenChange={setShowLimitDialog}
        columnId={columnId}
        currentLimit={wipLimit}
        currentCount={cardCount}
      />
    </div>
  )
}
