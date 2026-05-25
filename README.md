# Microservice Manager

A local desktop app for monitoring the health of multiple microservices running on your machine. Instead of checking each service individually, you get a live dashboard showing which services are running, erroring, or unreachable — all at a glance.

Built with Electron, React, and SQLite. No accounts, no cloud, no deployment. Your data stays on your machine.

## Features

- Organize services into projects
- Live health polling every 5 seconds per service
- P50/P95/P99 latency charts per service
- Search and filter by status (Running / Error / Dead)
- Dark mode
- Persistent storage via SQLite

## Prerequisites

- [Node.js](https://nodejs.org) v18 or later
- Git

## Setup

```bash
git clone <repo-url>
cd microservice-manager
npm install
npx prisma migrate deploy
npm run dev
```

## Mock services

Three local mock services are included for testing the UI without real services:

```bash
npm run services   # starts auth(:3001), user(:3002), payment(:3003)
```

Each responds with HTTP 200. To test error states, change `writeHead(200)` to `writeHead(500)` in the relevant file under `mock-services/`. To test the `dead` state, just don't start that service.
