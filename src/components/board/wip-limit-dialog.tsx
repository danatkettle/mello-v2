import { useState, useEffect } from "react"
import { AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useBoard } from "@/lib/board-context"

interface WipLimitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  columnId: string
  currentLimit?: number
  currentCount: number
}

export function WipLimitDialog({
  open,
  onOpenChange,
  columnId,
  currentLimit,
  currentCount,
}: WipLimitDialogProps) {
  const { dispatch } = useBoard()
  const [limit, setLimit] = useState(currentLimit?.toString() ?? "5")

  useEffect(() => {
    if (open) {
      setLimit(currentLimit?.toString() ?? "5")
    }
  }, [open, currentLimit])

  const handleSave = () => {
    const parsedLimit = parseInt(limit, 10)
    if (!isNaN(parsedLimit) && parsedLimit >= 1) {
      dispatch({ type: "SET_WIP_LIMIT", columnId, limit: parsedLimit })
      onOpenChange(false)
    }
  }

  const proposedLimit = parseInt(limit, 10)
  const showWarning = !isNaN(proposedLimit) && currentCount > proposedLimit

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{currentLimit !== undefined ? "Edit WIP Limit" : "Set WIP Limit"}</DialogTitle>
          <DialogDescription>
            Set a Work In Progress limit to help identify bottlenecks. This is a soft warning that won't block
            operations.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="limit" className="text-right text-sm font-medium">
              Limit
            </label>
            <Input
              id="limit"
              type="number"
              min="1"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave()
                if (e.key === "Escape") onOpenChange(false)
              }}
              className="col-span-3"
            />
          </div>
          {showWarning && (
            <div className="flex items-start gap-2 rounded-md bg-amber-50 border border-amber-200 p-3">
              <AlertCircle className="size-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-sm text-amber-900">
                Current card count ({currentCount}) exceeds the proposed limit ({proposedLimit}). The column will
                show a warning badge.
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
