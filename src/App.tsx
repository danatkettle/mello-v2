import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="mx-auto max-w-sm space-y-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight">mello v2</h1>
        <p className="text-muted-foreground">
          React + Vite + Tailwind CSS + shadcn/ui
        </p>
        <Button size="lg">Get Started</Button>
      </div>
    </div>
  )
}

export default App
