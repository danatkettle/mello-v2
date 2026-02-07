import { ScrollArea } from "@/components/ui/scroll-area"
import { useBoard } from "@/lib/board-context"
import { TIME_SLOTS, formatTimeSlot } from "@/lib/planner-utils"
import { TimeSlot } from "./time-slot"
import type { CalendarEntry } from "@/types/board"
import { CalendarCardChip } from "./calendar-card-chip"

interface TimeSlotListProps {
  date: string
}

interface LayoutEntry {
  entry: CalendarEntry
  startIndex: number
  duration: number
  endIndex: number
  column: number
}

export function TimeSlotList({ date }: TimeSlotListProps) {
  const { state, dispatch } = useBoard()
  const slotCount = TIME_SLOTS.length
  const slotIndex = new Map(TIME_SLOTS.map((slot, index) => [slot, index]))
  const entries: LayoutEntry[] = []

  for (const entry of Object.values(state.calendarEntries)) {
    if (entry.date !== date) continue
    const startIndex = slotIndex.get(entry.timeSlot)
    if (startIndex === undefined) continue
    const maxDuration = Math.max(1, slotCount - startIndex)
    const duration = Math.min(maxDuration, Math.max(1, entry.durationSlots ?? 1))
    entries.push({
      entry,
      startIndex,
      duration,
      endIndex: startIndex + duration,
      column: 0,
    })
  }

  entries.sort((a, b) => a.startIndex - b.startIndex || b.duration - a.duration)
  const active: LayoutEntry[] = []
  for (const entry of entries) {
    for (let i = active.length - 1; i >= 0; i -= 1) {
      if (active[i].endIndex <= entry.startIndex) active.splice(i, 1)
    }
    const used = new Set(active.map((item) => item.column))
    let column = 0
    while (used.has(column)) column += 1
    entry.column = column
    active.push(entry)
  }

  const maxColumns = Math.max(1, ...entries.map((entry) => entry.column + 1))

  return (
    <ScrollArea className="flex-1">
      <div className="flex" style={{ ["--slot-row-height" as string]: "44px" }}>
        <div className="w-16 shrink-0">
          <div
            className="grid text-xs text-muted-foreground"
            style={{ gridTemplateRows: `repeat(${slotCount}, var(--slot-row-height))` }}
          >
            {TIME_SLOTS.map((slot) => (
              <div key={slot} className="pt-1 pr-2 text-right">
                {formatTimeSlot(slot)}
              </div>
            ))}
          </div>
        </div>
        <div
          className="relative flex-1"
          data-slot-grid="true"
          style={{
            height: `calc(var(--slot-row-height) * ${slotCount})`,
            ["--entry-gap" as string]: "6px",
          }}
        >
          <div
            className="grid"
            style={{ gridTemplateRows: `repeat(${slotCount}, var(--slot-row-height))` }}
          >
            {TIME_SLOTS.map((slot) => (
              <TimeSlot key={slot} timeSlot={slot} date={date} />
            ))}
          </div>
          <div className="absolute inset-0 pointer-events-none">
            {entries.map((layout) => {
              const card = state.cards[layout.entry.cardId]
              if (!card) return null
              const width = `calc((100% - (${maxColumns - 1} * var(--entry-gap))) / ${maxColumns})`
              const left = `calc(${layout.column} * ((100% - (${maxColumns - 1} * var(--entry-gap))) / ${maxColumns}) + ${layout.column} * var(--entry-gap))`
              return (
                <CalendarCardChip
                  key={layout.entry.id}
                  entryId={layout.entry.id}
                  cardTitle={card.title}
                  durationSlots={layout.duration}
                  maxDurationSlots={slotCount - layout.startIndex}
                  onResize={(nextDuration) => {
                    dispatch({
                      type: "RESIZE_CALENDAR_ENTRY",
                      entryId: layout.entry.id,
                      durationSlots: nextDuration,
                    })
                  }}
                  className="absolute pointer-events-auto"
                  style={{
                    top: `calc(var(--slot-row-height) * ${layout.startIndex})`,
                    height: `calc(var(--slot-row-height) * ${layout.duration})`,
                    width,
                    left,
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
