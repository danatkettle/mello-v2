# Google Calendar Integration Spec

## Context

The Mello v2 planner shows time slots (9 AM–4:30 PM) where you drag Kanban cards to schedule work. Currently there's no way to see existing calendar commitments, so you can't tell which slots are actually free. This spec adds Google Calendar OAuth sign-in and renders your events as subtle background blocks behind the time slots.

**No new npm dependencies required** — uses GIS via script tag, `date-fns` (already installed), and browser `fetch`.

---

## New Files (5)

### 1. `src/types/google-identity.d.ts`
TypeScript ambient declarations for the GIS `google.accounts.oauth2` namespace (TokenClient, TokenResponse, initTokenClient, revoke).

### 2. `src/lib/google-calendar-context.tsx`
Auth provider mirroring the existing `board-context.tsx` pattern:
- Creates `GoogleCalendarContext` + `GoogleCalendarProvider` + `useGoogleCalendar()` hook
- State: `accessToken`, `isSignedIn`, `isLoading`, `error`
- Actions: `signIn()` (calls `tokenClient.requestAccessToken`), `signOut()` (calls `revoke`)
- Token stored in React state + `sessionStorage` (survives page refresh within tab, auto-cleared on expiry)
- Initializes GIS `TokenClient` on mount (retries until script loads)
- Proactive token refresh via `setTimeout` ~5 min before expiry
- Scope: `calendar.events.readonly` (read-only, minimum permission)
- Gracefully no-ops if `VITE_GOOGLE_CLIENT_ID` env var is missing

### 3. `src/lib/google-calendar-utils.ts`
- **Types**: `GoogleCalendarEvent`, `SlotPosition` (topPx, heightPx, title, time labels)
- **`fetchEventsForDate(token, date)`**: Calls Google Calendar API v3 `/calendars/primary/events` with `timeMin`/`timeMax` for the selected day, `singleEvents=true`, sparse field selector. Filters out all-day and cancelled events.
- **`mapEventToSlotPosition(event, slotHeightPx)`**: Parses event start/end → minutes since midnight → pixel position. Grid range 540–1020 min (9 AM–5 PM). Clamps to visible range, returns `null` if entirely outside.

### 4. `src/hooks/use-google-events.ts`
- `useGoogleEvents(date: string)` → `{ events: SlotPosition[], isLoading, error }`
- Consumes `useGoogleCalendar()` for the access token
- Fetches events when `date` or `accessToken` changes
- Cleanup via cancelled flag to prevent stale state updates

### 5. `src/components/planner/google-event-block.tsx`
Presentational component for one Google Calendar event block:
- Absolutely positioned via `top`/`height` from `SlotPosition`
- **`pointer-events-none`** so drag-and-drop still works on top
- Styling: `bg-chart-2/8` background (subtle teal at 8% opacity), `border-l-2 border-chart-2/40` left accent
- Shows event title (always) + time range (only if block tall enough)
- Uses existing `cn()` utility and Tailwind theme colors

---

## Modified Files (4)

### 6. `index.html`
Add before `</head>`:
```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

### 7. `src/App.tsx`
Wrap with `GoogleCalendarProvider` outside `BoardProvider`:
```tsx
<GoogleCalendarProvider>
  <BoardProvider>
    <AppLayout />
  </BoardProvider>
</GoogleCalendarProvider>
```

### 8. `src/components/planner/planner-header.tsx`
Add a Google Calendar connect/disconnect button between the date picker and close button:
- Not signed in → outlined "Connect" button with `CalendarDays` icon
- Signed in → ghost "Connected" button (teal text) that disconnects on click
- Hidden entirely if `VITE_GOOGLE_CLIENT_ID` is not set

### 9. `src/components/planner/time-slot-list.tsx`
**Core change**: Insert a Google event background layer between the existing two layers (base grid and card chip overlay):

```
Layer 1: Base grid of TimeSlot drop targets      (existing, line 80-87)
Layer 2: Google Calendar event blocks             (NEW — pointer-events-none)
Layer 3: Mello CalendarCardChip overlays          (existing, line 88-118)
```

Add `useGoogleEvents(date)` call at the top of the component, then render:
```tsx
<div className="absolute inset-0 pointer-events-none">
  {googleEvents.map((event) => (
    <GoogleEventBlock key={event.eventId} event={event} />
  ))}
</div>
```

---

## Environment Setup

- Create `.env.example` with `VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com`
- `.gitignore` already covers `*.local` so `.env.local` is safe for the actual key
- User must create a Google Cloud project, enable Calendar API, create OAuth client ID, and add it to `.env.local`

---

## Implementation Order

1. Environment + GIS script tag (`index.html`, `.env.example`)
2. Type declarations (`google-identity.d.ts`)
3. Utility functions (`google-calendar-utils.ts`)
4. Auth context (`google-calendar-context.tsx`)
5. Event-fetching hook (`use-google-events.ts`)
6. Event block component (`google-event-block.tsx`)
7. Wire into time-slot-list (`time-slot-list.tsx`)
8. Add connect button (`planner-header.tsx`)
9. Add provider (`App.tsx`)

---

## Verification

1. `npm run build` — TypeScript + Vite build passes
2. `npm run lint` — No lint errors
3. Without env var: app works normally, no Google Calendar UI visible
4. With env var: "Connect" button appears in planner header → OAuth popup → events render as teal background blocks behind time slots → drag-and-drop still works on top of blocks
5. Changing selected date re-fetches events
6. "Connected" button disconnects and clears events
7. Page refresh within same tab retains connection (sessionStorage token)
