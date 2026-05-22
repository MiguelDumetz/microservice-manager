# Microservice Manager

## What This App Does

A local developer tool for monitoring the health of multiple microservices running on your machine. Developers working on projects with multiple services (auth, payments, user service, etc.) can see the live status of all of them at a glance without checking each one individually.

The app is **local-first** — no accounts, no cloud, no deployment. A dev clones the repo, runs it, and their data stays on their machine.

For full architecture details (tech stack, backend, component structure, key patterns), see **[ARCHITECTURE.md](./ARCHITECTURE.md)**.

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
npm run dev        # start Vite dev server + Express backend (concurrently)
npm run typecheck  # run TypeScript compiler check (no emit)
npm run lint       # run ESLint
npm run services   # start all three mock services
```
