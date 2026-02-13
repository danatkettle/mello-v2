import { CalendarDays, LogOut, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useBoard } from "@/lib/board-context"
import { useState } from "react"

interface HeaderProps {
  isPlannerOpen: boolean
  onTogglePlanner: () => void
}

export function Header({ isPlannerOpen, onTogglePlanner }: HeaderProps) {
  const { resetBoard, saveError, forceSyncBoard } = useBoard()
  const [isSyncing, setIsSyncing] = useState(false)

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout? This will clear all your boards and reset to defaults.")) {
      resetBoard()
    }
  }

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      await forceSyncBoard()
    } catch {
      // Error already handled in context
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card/80 backdrop-blur-sm px-6 shadow-sm">
      <h1 className="text-2xl font-serif font-semibold tracking-tight text-primary">Mello</h1>
      <div className="flex items-center gap-2">
        {saveError && (
          <>
            <div className="flex items-center gap-2 rounded-md bg-red-50 px-3 py-1.5 text-sm text-red-700">
              <AlertCircle className="size-4" />
              <span className="font-medium">Save failed</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSync}
              disabled={isSyncing}
              className="gap-1.5 font-medium"
            >
              <RefreshCw className={`size-4 ${isSyncing ? 'animate-spin' : ''}`} />
              Retry
            </Button>
          </>
        )}
        <Button
          variant={isPlannerOpen ? "default" : "ghost"}
          size="sm"
          onClick={onTogglePlanner}
          className="gap-1.5 font-medium"
        >
          <CalendarDays className="size-4" />
          Planner
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="gap-1.5 font-medium text-muted-foreground hover:text-foreground"
        >
          <LogOut className="size-4" />
          Logout
        </Button>
      </div>
    </header>
  )
}
