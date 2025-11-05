# Automaspec

Test management dashboard built with Next.js, Drizzle ORM, and Better Auth.

## Overview

Automaspec helps organize test specifications, requirements, and individual tests in a foldered hierarchy with per‑spec status breakdowns. It includes authentication, organizations, and a dashboard UI.

## Tech Stack

- Next.js 15 (Turbopack) + React 19
- Drizzle ORM with libsql/Turso
- Better Auth (with organizations plugin)
- oRPC + TanStack Query
- Tailwind CSS v4
- Vitest + React Testing Library
- Lefthook, Prettier, Oxlint

## Prerequisites

- Node.js (active LTS recommended)
- pnpm
- Turso CLI (for `turso dev`) or another libsql-compatible server

## Setup

1) Install dependencies
>>>>>>> 77c10dd (Update .gitignore, add AGENTS.md for coding rules, and enhance README.md)

```bash
pnpm install
```

2) Environment variables

Copy `.env.example` to `.env.local` (already provided in the repo root):

```env
NEXT_PUBLIC_DATABASE_URL=http://127.0.0.1:8080
DATABASE_AUTH_TOKEN=
# Optional: VERCEL_URL=your-vercel-deployment-url
```

3) Database (local libsql)

Start a local libsql dev server backed by `db/local.db`:

```bash
pnpm db:local
```

In another terminal, run migrations:

```bash
pnpm dbm
```

Optional: open Drizzle Studio

```bash
pnpm dbs
```

Optional: seed sample data into `db/local.db`:

```bash
sqlite3 db/local.db < sample_data.sql
```

## Run

```bash
pnpm dev     # start Next.js (Turbopack)
pnpm build   # build
pnpm start   # run production build
```

## Testing

```bash
pnpm test             # run unit/component tests
pnpm test --watch     # watch mode
pnpm test __tests__/components/tree.test.tsx
```

Notes:
- Integration tests are skipped by default; to enable, set `NEXT_PUBLIC_DATABASE_URL` to a reachable libsql endpoint.

## Git Hooks

Managed with [Lefthook](https://lefthook.dev/). Hooks are installed automatically on `postinstall`.

Pre-commit (configured in `lefthook.yml`):
- Database schema check: `drizzle-kit check` on `db/schema/*.ts`
- Format: Prettier write
- Lint: Oxlint with autofix
- TODO/FIXME notice (non-blocking)

Pre-push: currently disabled (commented out in `lefthook.yml`). Uncomment to enable if desired.

Manual execution examples:

```bash
pnpx lefthook run pre-commit
# pnpx lefthook run pre-push   # if you enable it in lefthook.yml
```

## Scripts

Common scripts (see `package.json`):

- `dev`, `build`, `start`
- `test`
- `db:local`, `dbg` (generate), `dbm` (migrate), `dbs` (studio), `dbup` (generate+migrate)
- `lint`, `format`, `typecheck` (lefthook-driven jobs)

## Notes

- The app reads database credentials from `NEXT_PUBLIC_DATABASE_URL` and `DATABASE_AUTH_TOKEN` (see `db/index.ts` and `drizzle.config.ts`).
- Better Auth trusted origins use `VERCEL_URL` in production if set.
