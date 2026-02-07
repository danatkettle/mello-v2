import { useState } from "react"
import type { Card } from "@/types/board"
import { useBoard } from "@/lib/board-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface CardDialogProps {
  card: Card
  columnId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CardDialog({ card, columnId, open, onOpenChange }: CardDialogProps) {
  const { dispatch } = useBoard()
  const [title, setTitle] = useState(card.title)
  const [description, setDescription] = useState(card.description)

  const handleSave = () => {
    const trimmed = title.trim()
    if (!trimmed) return
    dispatch({ type: "UPDATE_CARD", cardId: card.id, title: trimmed, description: description.trim() })
    onOpenChange(false)
  }

  const handleDelete = () => {
    dispatch({ type: "DELETE_CARD", cardId: card.id, columnId })
    onOpenChange(false)
  }

  // Reset form when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setTitle(card.title)
      setDescription(card.description)
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Card</DialogTitle>
          <DialogDescription>Update the card title and description.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="card-title" className="text-sm font-medium">Title</label>
            <Input
              id="card-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSave() }}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="card-desc" className="text-sm font-medium">Description</label>
            <Textarea
              id="card-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="destructive" size="sm" onClick={handleDelete} className="mr-auto">
            Delete
          </Button>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
