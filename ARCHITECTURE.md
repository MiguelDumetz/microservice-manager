# Architecture

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Routing | React Router v7 (`BrowserRouter`) |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite` plugin, no config file) |
| Data fetching | TanStack React Query v5 |
| Backend | Express 5 + TypeScript (`tsx` runtime) |
| ORM | Prisma v5 (SQLite) |
| Language | TypeScript strict mode — `npm run typecheck` to verify |

---

## Navigation Model

URL-based routing via React Router. Two routes, both wrapped in a persistent `Layout`:

| Path | Component |
|---|---|
| `/` | `ProjectDashboard` |
| `/projects/:projectId/services` | `ServiceDashboard` |

```
BrowserRouter (AppRouter.tsx)
 └── Layout (Navbar + <Outlet />)
      ├── /                             → ProjectDashboard
      └── /projects/:projectId/services → ServiceDashboard
```

### Navigation flow
- `ProjectDashboard` calls `useNavigate()` and pushes `/projects/${id}/services` when a project is selected.
- `ServiceDashboard` calls `useParams()` to extract `projectId` from the URL; it has no dependency on parent state.
- A "← Return to dashboard" button in `ServiceDashboard` navigates back to `/`.

### Theme state flow
Theme is initialized in `App.tsx` via `useTheme()` and prop-drilled down to `Navbar`:

```
App (isDark, toggle)
 └── AppRouter (isDark, onToggleTheme)
      └── Layout (isDark, onToggleTheme)
           └── Navbar (isDark, onToggleTheme)
```

---

## Data Model

```prisma
model Project {
  id       Int       @id @default(autoincrement())
  name     String
  services Service[]
}

model Service {
  id        Int     @id @default(autoincrement())
  name      String
  url       String
  projectId Int
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
}
```

Schema lives in `prisma/schema.prisma`. SQLite database file is `prisma/dev.db`.

---

## Backend

### Entry point — `server/index.ts`
Express app on port 3030. Mounts two routers:

```
POST/GET/PATCH/DELETE  /api/projects
POST/GET/PATCH/DELETE  /api/projects/:projectId/services
```

### Files
```
server/
├── index.ts              ← Express app, CORS, JSON middleware
├── db.ts                 ← singleton PrismaClient
└── routes/
    ├── projects.ts       ← CRUD for projects
    └── services.ts       ← CRUD for services (nested under /:projectId)
```

### TypeScript config
`tsconfig.server.json` — separate config for the server so it targets Node.js:
- `"module": "CommonJS"`, `"moduleResolution": "node"`
- `"ignoreDeprecations": "6.0"` (suppresses deprecated `node` moduleResolution warning in TS 6)
- `"include": ["server"]`

### Dev proxy
Vite proxies `/api` → `http://localhost:3030` so the frontend can call `/api/projects` without CORS issues in dev. See `vite.config.ts`.

---

## Frontend API Layer

```
src/api/
├── projects.ts   ← fetchProjects, createProject, updateProject, deleteProjects
└── services.ts   ← fetchServices, createService, updateService, deleteServices
```

All functions call `fetch('/api/...')`. React Query `useQuery`/`useMutation` calls wrap these in components and dashboards.

---

## Component Structure

```
src/
├── App.tsx                          ← theme state via useTheme(); renders AppRouter
├── AppRouter.tsx                    ← BrowserRouter + Routes; defines / and /projects/:projectId/services
├── App.css                          ← Tailwind import, dark variant, 3xl breakpoint, no-transitions class
├── types.ts                         ← Project, Service, ServiceStatus
├── main.tsx                         ← QueryClientProvider wraps App
├── api/
│   ├── projects.ts
│   └── services.ts
├── Hooks/
│   ├── useSelectable.ts             ← shared selection/delete logic
│   └── useProjectStatus.ts          ← polls all service URLs for a project, returns {running,error,dead,total}
└── components/
    ├── Layout.tsx                   ← stateless shell: Navbar + <Outlet /> for nested routes
    ├── Button.tsx                   ← primary / secondary / danger variants
    ├── IconButton.tsx               ← circular icon button, secondary / danger variants
    ├── Navbar.tsx                   ← brand, projects dropdown, dark/light toggle
    ├── SearchBar.tsx                ← controlled search input
    ├── StatusFilterTabs.tsx         ← All / Running / Error / Dead filter pills
    ├── DeleteConfirmModal.tsx       ← shared confirmation dialog
    ├── Skeleton.tsx                 ← ProjectCardSkeleton, ServiceCardSkeleton
    ├── LatencyChart.tsx             ← SVG P50/P95/P99 curves (or flatline for dead)
    ├── Projects/
    │   ├── Dashboard.tsx            ← project list, search, skeletons, empty state
    │   ├── Card.tsx                 ← project card with status dots + edit/delete
    │   ├── AddButton.tsx            ← opens AddForm
    │   └── AddForm.tsx              ← name-only form (create + edit + delete)
    └── Services/
        ├── Dashboard.tsx            ← service list, search, filter tabs, latency toggle
        ├── Card.tsx                 ← service card with live health + latency chart
        ├── AddButton.tsx            ← opens AddForm
        └── AddForm.tsx              ← name + URL form (create + edit + delete)
```

---

## Service Health Polling

Each `Services/Card.tsx` uses `useQuery` with `refetchInterval: 5000` to poll its URL every 5 seconds. Status is derived from the fetch result — never stored:

- `running` — fetch resolved with `res.ok === true`
- `error` — fetch resolved with non-2xx status (error code displayed, e.g. "ERROR 500")
- `dead` — fetch threw (connection refused, timeout after 3s via `AbortSignal.timeout`)

Latency is measured with `performance.now()` around each fetch and stored in a `useRef<number[]>` (rolling 30 entries). The ref resets when `url` changes.

---

## Latency Chart

`LatencyChart.tsx` renders a pure SVG (viewBox 400×72) with three bezier curves:

- **P50** — green `#22c55e`
- **P95** — amber `#f59e0b`
- **P99** — red `#ef4444`

Special cases:
- `dead` → dashed gray flatline at y=36 + "Unreachable" label
- `< 2 data points` → grid only + "Collecting data…" label

Percentiles are computed as rolling series (each point = percentile of all history up to that index), so the chart is meaningful from just 2 data points.

---

## Key Patterns

### `useSelectable` hook
Both dashboards share identical selection/delete state. `src/Hooks/useSelectable.ts` takes `onDelete: (ids: number[]) => Promise<void>` and manages `isSelecting`, `selectedIds`, `showConfirm`, and all handlers.

### `useProjectStatus` hook
`src/Hooks/useProjectStatus.ts` fetches all services for a project then reads their cached React Query status entries (`['status', url]`). Returns `{running, error, dead, total}`. Refetch interval is adaptive — 30s when all services are dead, 5s otherwise.

### Button / IconButton components
- `Button.tsx` — three variants: `primary`, `secondary`, `danger`. Always use instead of raw `<button>`.
- `IconButton.tsx` — circular button for icon actions. Same variants.

### Dynamic Tailwind classes
Never build class names dynamically (`border-${color}-500`). Always write full class names in static lookup objects:

```ts
const STATUS_STYLES: Record<ServiceStatus, StatusStyle> = {
  running: { border: 'border-green-500/50', ... },
  ...
}
```

### Dark mode
`@custom-variant dark (&:is(.dark, .dark *))` in `App.css`. Toggle adds/removes `dark` class on `<html>`. Instant switching (no fade) is achieved by briefly adding a `no-transitions` class around the toggle via double `requestAnimationFrame`.

### Custom breakpoints
`@variant 3xl (@media (width >= 1920px))` in `App.css`. Grid layout: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4`.

### Last-viewed project
On project selection, `ProjectDashboard` navigates to `/projects/${id}/services` via React Router. The browser URL itself persists the current project, so a full-page reload reopens the same service dashboard directly.

---

## What's Implemented

- [x] Project dashboard — add, edit, remove, select projects
- [x] Service dashboard — add, edit, remove services per project
- [x] Live health polling per service card (5s interval)
- [x] HTTP error codes shown on error cards (e.g. "ERROR 500")
- [x] Navbar with projects dropdown and dark/light toggle
- [x] Selection mode with multi-delete + confirmation modal
- [x] Shared `useSelectable` and `useProjectStatus` hooks
- [x] Express + Prisma + SQLite backend (persistent storage)
- [x] REST API with full CRUD for projects and services
- [x] Search and status filter (All/Running/Error/Dead) on both dashboards
- [x] Loading skeletons and empty states
- [x] P50/P95/P99 latency chart per service card (togglable)
- [x] Status recap dots (running/error/dead counts) on project cards and service dashboard
- [x] Responsive layout (mobile / lg / 2xl / 3xl)
- [x] Dark mode with instant switching
- [x] URL-based routing via React Router (BrowserRouter, nested routes, useNavigate/useParams)
- [x] Persistent layout shell (Layout.tsx) with Navbar across all routes
- [x] Deep-linkable service dashboard via `/projects/:projectId/services`
- [x] Green Activity favicon
- [x] Full TypeScript strict mode
