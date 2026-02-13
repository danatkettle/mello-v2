import { useState } from "react"
import { CalendarIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface PlannerHeaderProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  onClose: () => void
}

export function PlannerHeader({ selectedDate, onDateChange, onClose }: PlannerHeaderProps) {
  const [popoverOpen, setPopoverOpen] = useState(false)

  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })

  return (
    <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
      <div className="flex items-center gap-2">
        <h2 className="font-serif text-base font-semibold">Planner</h2>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs font-medium">
              <CalendarIcon className="size-3.5" />
              {formattedDate}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  onDateChange(date)
                  setPopoverOpen(false)
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <Button variant="ghost" size="icon-xs" onClick={onClose}>
        <X className="size-4" />
      </Button>
    </div>
  )
}
