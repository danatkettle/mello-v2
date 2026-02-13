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
        className="flex h-fit w-72 shrink-0 items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/25 bg-primary/5 p-4 text-sm font-medium text-primary/70 transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary hover:scale-[1.02]"
      >
        <Plus className="size-4" />
        Add column
      </button>
    )
  }

  return (
    <div className="w-72 shrink-0 space-y-2 rounded-2xl border border-border/60 bg-card shadow-[0_2px_12px_rgba(59,130,246,0.08)] p-4">
      <Input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit()
          if (e.key === "Escape") handleCancel()
        }}
        placeholder="Column title..."
        className="h-9 text-sm font-medium"
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
