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
        "flex flex-col border-l bg-background transition-all duration-300 overflow-hidden",
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
