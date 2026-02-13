import { useState, useRef, useEffect } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useBoard } from "@/lib/board-context"

interface AddCardFormProps {
  columnId: string
}

export function AddCardForm({ columnId }: AddCardFormProps) {
  const { dispatch } = useBoard()
  const [isAdding, setIsAdding] = useState(false)
  const [title, setTitle] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isAdding) {
      textareaRef.current?.focus()
    }
  }, [isAdding])

  const handleSubmit = () => {
    const trimmed = title.trim()
    if (trimmed) {
      dispatch({ type: "ADD_CARD", columnId, title: trimmed })
      setTitle("")
      textareaRef.current?.focus()
    }
  }

  const handleCancel = () => {
    setTitle("")
    setIsAdding(false)
  }

  if (!isAdding) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
        onClick={() => setIsAdding(true)}
      >
        <Plus className="size-4" />
        Add a card
      </Button>
    )
  }

  return (
    <div className="space-y-2 px-1">
      <Textarea
        ref={textareaRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
          }
          if (e.key === "Escape") handleCancel()
        }}
        placeholder="Enter a title for this card..."
        className="min-h-[60px] resize-none text-sm"
      />
      <div className="flex items-center gap-1">
        <Button size="sm" onClick={handleSubmit}>
          Add card
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={handleCancel}>
          <X className="size-4" />
        </Button>
      </div>
    </div>
  )
}
