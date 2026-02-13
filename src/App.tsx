import { BoardProvider, useBoard } from "@/lib/board-context"
import { AppLayout } from "@/components/app-layout"

function AppContent() {
  const { isLoading } = useBoard()

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="text-sm text-slate-600">Loading your board...</p>
        </div>
      </div>
    )
  }

  return <AppLayout />
}

function App() {
  return (
    <BoardProvider>
      <AppContent />
    </BoardProvider>
  )
}

export default App
