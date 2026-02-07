import { useState, useRef, useEffect } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useBoard } from "@/lib/board-context"

export function AddColumnButton() {
  const { dispatch } = useBoard()
  const [isAdding, setIsAdding] = useState(false)
  const [title, setTitle] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isAdding) {
      inputRef.current?.focus()
    }
  }, [isAdding])

  const handleSubmit = () => {
    const trimmed = title.trim()
    if (trimmed) {
      dispatch({ type: "ADD_COLUMN", title: trimmed })
      setTitle("")
      setIsAdding(false)
    }
  }

  const handleCancel = () => {
    setTitle("")
    setIsAdding(false)
  }

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="flex h-fit w-72 shrink-0 items-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/25 p-3 text-sm text-muted-foreground transition-colors hover:border-muted-foreground/50 hover:text-foreground"
      >
        <Plus className="size-4" />
        Add column
      </button>
    )
  }

  return (
    <div className="w-72 shrink-0 space-y-2 rounded-xl border bg-card p-3">
      <Input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit()
          if (e.key === "Escape") handleCancel()
        }}
        placeholder="Column title..."
        className="h-8 text-sm"
      />
      <div className="flex items-center gap-1">
        <Button size="sm" onClick={handleSubmit}>
          Add column
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={handleCancel}>
          <X className="size-4" />
        </Button>
      </div>
    </div>
  )
}
