# Microservice Manager

## What This App Does

A local developer tool for monitoring the health of multiple microservices running on your machine. Developers working on projects with multiple services (auth, payments, user service, etc.) can see the live status of all of them at a glance without checking each one individually.

The app is **local-first** — no accounts, no cloud, no deployment. A dev clones the repo, runs it, and their data stays on their machine.

---

## Architecture Overview

### Navigation Model
The app uses **state-based navigation** (no router). `App.tsx` holds a `selectedProject` state. When null, the project dashboard renders. When set, the service dashboard for that project renders.

```
App
 ├── selectedProject === null → ProjectDashboard
 └── selectedProject !== null → ServiceDashboard
```

### Data Model
```
Project
  id: number
  name: string

Service
  id: number
  name: string
  url: string      ← the URL the app polls for health status
```

Projects and services currently live in React state (not persisted). The next major feature is adding a local SQLite + Express backend to persist them.

### Service Health Polling
Each `Services/Card.tsx` uses React Query's `useQuery` with `refetchInterval: 5000` to poll its URL every 5 seconds. Status is derived from the fetch result — it is never stored:

- `running` — fetch resolved with `res.ok === true`
- `error` — fetch resolved with a non-2xx status (error code is captured and displayed, e.g. "ERROR 500")
- `dead` — fetch threw (connection refused, timeout after 3s)

### Component Structure
```
src/
├── App.tsx                          ← navigation state, projects state
├── types.ts                         ← Project, Service, ServiceStatus
├── main.tsx                         ← QueryClientProvider wraps App
├── Hooks/
│   └── useSelectable.ts             ← shared selection/delete logic
└── components/
    ├── Button.tsx                   ← primary / secondary / danger variants
    ├── Navbar.tsx                   ← projects dropdown
    ├── DeleteConfirmModal.tsx       ← shared confirmation dialog
    ├── Projects/
    │   ├── Dashboard.tsx            ← project list page
    │   ├── Card.tsx                 ← single project card (name only)
    │   ├── AddButton.tsx            ← opens AddForm
    │   └── AddForm.tsx              ← name-only form
    └── Services/
        ├── Dashboard.tsx            ← service list for a project
        ├── Card.tsx                 ← service card with live health status
        ├── AddButton.tsx            ← opens AddForm
        └── AddForm.tsx              ← name + URL form
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 (no config file needed, uses `@tailwindcss/vite` plugin) |
| Data fetching | TanStack React Query v5 |
| Language | TypeScript — strict mode, `npm run typecheck` to verify |

---

## Key Patterns

### `useSelectable` hook
Both `ProjectDashboard` and `ServiceDashboard` share identical selection/delete state logic. This is extracted into `src/Hooks/useSelectable.ts`. It takes `setItems` as a parameter and manages `isSelecting`, `selectedIds`, `showConfirm`, and all handlers. Neither dashboard owns this logic directly.

### Button component
`src/components/Button.tsx` is the single source of truth for button styling. Always use it instead of raw `<button>` elements. Three variants: `primary` (default), `secondary`, `danger`.

### Dynamic Tailwind classes
Tailwind scans source files statically. Never build class names dynamically from strings (e.g. `border-${color}-500`). Always write complete class names and use lookup objects keyed by value:
```ts
const STATUS_STYLES: Record<ServiceStatus, StatusStyle> = {
  running: { border: 'border-green-500/30', ... },
  ...
}
```

### Projects state lives in App
The projects array is owned by `App.tsx` (not by `ProjectDashboard`) so it can be shared with `Navbar` for the dropdown. `ProjectDashboard` receives `projects` and `setProjects` as props.

---

## What's Implemented

- [x] Project dashboard — add, remove, select projects
- [x] Service dashboard — add, remove services per project
- [x] Live health polling per service card (5s interval)
- [x] HTTP error codes shown on error cards (e.g. "ERROR 500")
- [x] Navbar with projects dropdown
- [x] "Return to dashboard" button on service page
- [x] Selection mode with multi-delete + confirmation modal
- [x] Shared `useSelectable` hook
- [x] Full TypeScript with strict mode

---

## What's Next

The app currently has no persistence — data resets on page refresh. The agreed next step is:

**Local Express + SQLite backend**
- `server/` folder added to the repo
- Prisma ORM with SQLite (zero infrastructure, just a file)
- REST API: `GET/POST/DELETE /api/projects` and `GET/POST/DELETE /api/projects/:id/services`
- Frontend swaps hardcoded state for `useQuery` / `useMutation` calls
- No auth — local tool, single user per device

---

## Mock Services

Three Node.js mock services exist in `mock-services/` for testing the health polling UI:

```bash
npm run services   # starts all three: auth(:3001), user(:3002), payment(:3003)
```

Each responds with 200 and `Access-Control-Allow-Origin: *`. To test error states, change `writeHead(200)` to `writeHead(500)` in the relevant file. To test the `dead` state, just don't start that service.

---

## Agents

Four specialized subagents are available. Use them instead of doing the work inline in the main context.

### `codebase-analyst`
Use before touching any code when the task spans multiple files or requires understanding how things are connected. It reads files and reports facts — you make the decisions based on what it returns. Never do multi-file reads yourself in the main context.

**Use it when:**
- Planning a refactor or new feature that touches more than 2 files
- You need to understand how a component is wired before changing it
- Checking the current state of files after the user has made edits

**Do not use it for:** code review, design decisions, or anything that requires judgment — it reports structure, not opinions.

---

### `build-tester`
Use after every code change to verify correctness. Runs on Haiku (cheaper/faster). Never simulate or assume a command succeeded — delegate to this agent and synthesize its findings.

**Use it when:**
- After any edit — run `npm run typecheck` to catch type errors
- After installing packages or changing config
- To run `npm run lint` before considering a task done
- To verify a fix actually worked

**Default commands to run:**
```bash
npm run typecheck   # after any .ts/.tsx change
npm run lint        # before marking a task complete
```

---

### `Plan` (software architect agent)
Use before implementing anything non-trivial. Explores the codebase, identifies affected files, and returns a step-by-step implementation plan for approval before any code is written.

**Use it when:**
- Adding a new feature that touches more than 2-3 files
- Making architectural decisions (e.g. adding the backend)
- Unsure where a change should live

---

### `Explore`
Fast read-only search agent. Use for targeted lookups — finding where a symbol is defined, which files import a module, locating a pattern across the codebase.

**Use it when:**
- Finding where a specific function or type is defined
- Checking which files reference a component before renaming it
- Quick single-target lookups ("where is useSelectable used?")

**Do not use it for:** broad architectural analysis — use `codebase-analyst` for that.

---

## Commands

```bash
npm run dev        # start Vite dev server
npm run typecheck  # run TypeScript compiler check (no emit)
npm run lint       # run ESLint
npm run services   # start all three mock services
```
