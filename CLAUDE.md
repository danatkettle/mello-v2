# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # TypeScript check (tsc -b) then Vite production build
npm run lint      # ESLint on all .ts/.tsx files
```

No test runner is configured.

To add a shadcn/ui component: `npx shadcn@latest add <component-name>`

## Architecture

Mello v2 is a Trello-like Kanban board with a "Planner" side panel for scheduling cards onto a daily calendar. Built with React 19, TypeScript (strict), Vite, Tailwind CSS v4, and shadcn/ui (new-york style).

### State Management

`useReducer` + React Context, no external state library. All state flows through a single `BoardState` object:

- **`src/types/board.ts`** — Normalized data model: `Card`, `Column`, `CalendarEntry`, `BoardState`. Cards stored flat in `Record<id, Card>`, columns hold ordered `cardIds[]` arrays, calendar entries reference cards by ID.
- **`src/types/actions.ts`** — `BoardAction` discriminated union (all reducer actions).
- **`src/lib/board-reducer.ts`** — Pure reducer. Handles cascade deletes (deleting a column removes its cards and their calendar entries). Prevents duplicate calendar entries (same card + date + time slot).
- **`src/lib/board-context.tsx`** — `BoardProvider` wraps `useReducer`, exposes `useBoard()` hook. Reads from localStorage on mount (`"mello-v2-board"` key), writes via `useEffect` on every state change.
- **`src/lib/board-defaults.ts`** — Default board state (3 sample columns, 5 cards). ID generation via `crypto.randomUUID()`.

### Drag-and-Drop

Uses `@atlaskit/pragmatic-drag-and-drop` with `@atlaskit/pragmatic-drag-and-drop-hitbox` for edge detection.

**Pattern**: Each draggable/droppable component (`kanban-card.tsx`, `board-column.tsx`, `card-list.tsx`, `time-slot.tsx`) manages its own visual drag state. A single `monitorForElements` in `app-layout.tsx` handles ALL drop resolution and dispatches reducer actions.

- **`src/types/drag.ts`** — Drag data types with `[key: string]: unknown` index signatures (required by the library). Three drag types: `"card"`, `"column"`, `"calendar-slot"`.
- **Drop scenarios**: Card reorder (same column), card move (cross-column), card to empty column, card to calendar slot, column reorder.
- **Column drag** uses `dragHandle` (header ref) so card drags inside columns don't trigger column drags.
- **Stale closure prevention**: `app-layout.tsx` uses a `useRef` for state so the monitor effect only registers once (depends on `dispatch` only).

### Component Organization

- **`components/board/`** — Kanban board: columns, cards, add forms, edit dialog
- **`components/planner/`** — Right-side panel: date picker, time slots (9:00 AM–4:30 PM, 30-min intervals), calendar card chips
- **`components/ui/`** — shadcn/ui components (do not edit manually; managed by shadcn CLI)
- **`app-layout.tsx`** — Top-level layout + drag monitor coordinator
- **`header.tsx`** — App title + planner toggle button

### Planner

Cards are **copied** to the calendar (card stays in its Kanban column AND appears on the planner). Calendar entries reference cards by ID, so title changes auto-reflect. The planner is a fixed 380px right panel with CSS transition. Selected date is component-level state (not persisted).

## Key Conventions

- Path alias: `@/*` maps to `./src/*`
- Tailwind CSS v4 with CSS custom properties for theming (defined in `src/index.css`)
- `cn()` utility from `src/lib/utils.ts` for className merging (clsx + tailwind-merge)
- TypeScript strict mode with `noUnusedLocals` and `noUnusedParameters` enabled
- Files use kebab-case, components use PascalCase, constants use UPPER_SNAKE_CASE
