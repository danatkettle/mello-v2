import { CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  isPlannerOpen: boolean
  onTogglePlanner: () => void
}

export function Header({ isPlannerOpen, onTogglePlanner }: HeaderProps) {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b bg-background px-4">
      <h1 className="text-lg font-bold tracking-tight">Mello v2</h1>
      <Button
        variant={isPlannerOpen ? "secondary" : "ghost"}
        size="sm"
        onClick={onTogglePlanner}
      >
        <CalendarDays className="size-4" />
        Planner
      </Button>
    </header>
  )
}
