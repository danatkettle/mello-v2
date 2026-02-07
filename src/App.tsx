import { BoardProvider } from "@/lib/board-context"
import { AppLayout } from "@/components/app-layout"

function App() {
  return (
    <BoardProvider>
      <AppLayout />
    </BoardProvider>
  )
}

export default App
