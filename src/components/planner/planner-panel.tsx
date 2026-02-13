import { useState } from "react"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/planner-utils"
import { PlannerHeader } from "./planner-header"
import { TimeSlotList } from "./time-slot-list"

interface PlannerPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function PlannerPanel({ isOpen, onClose }: PlannerPanelProps) {
  const [selectedDate, setSelectedDate] = useState(new Date())

  return (
    <div
      className={cn(
        "flex flex-col border-l border-border/60 bg-card/60 backdrop-blur-sm transition-all duration-300 overflow-hidden shadow-[-4px_0_16px_rgba(59,130,246,0.04)]",
        isOpen ? "w-[380px]" : "w-0 border-l-0"
      )}
    >
      {isOpen && (
        <>
          <PlannerHeader
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onClose={onClose}
          />
          <TimeSlotList date={formatDate(selectedDate)} />
        </>
      )}
    </div>
  )
}
