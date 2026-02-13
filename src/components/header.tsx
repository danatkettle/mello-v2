import { CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  isPlannerOpen: boolean
  onTogglePlanner: () => void
}

export function Header({ isPlannerOpen, onTogglePlanner }: HeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card/80 backdrop-blur-sm px-6 shadow-sm">
      <h1 className="text-2xl font-serif font-semibold tracking-tight text-primary">Mello</h1>
      <Button
        variant={isPlannerOpen ? "default" : "ghost"}
        size="sm"
        onClick={onTogglePlanner}
        className="gap-1.5 font-medium"
      >
        <CalendarDays className="size-4" />
        Planner
      </Button>
    </header>
  )
}
