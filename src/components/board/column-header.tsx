import { useState, useRef, useEffect } from "react"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useBoard } from "@/lib/board-context"

interface ColumnHeaderProps {
  columnId: string
  title: string
  dragHandleRef: React.RefObject<HTMLDivElement | null>
}

export function ColumnHeader({ columnId, title, dragHandleRef }: ColumnHeaderProps) {
  const { dispatch } = useBoard()
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(title)
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

  return (
    <div
      ref={dragHandleRef}
      className="flex items-center justify-between px-2 py-2 cursor-grab active:cursor-grabbing"
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
          className="h-7 text-sm font-semibold"
        />
      ) : (
        <h3 className="truncate text-sm font-semibold px-1">{title}</h3>
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
          <DropdownMenuItem variant="destructive" onClick={handleDelete}>
            <Trash2 className="size-4" />
            Delete column
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
