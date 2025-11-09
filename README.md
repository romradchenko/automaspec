# Automaspec

## Development

### Git Hooks

This project uses [Lefthook](https://lefthook.dev/) for managing git hooks to ensure code quality and consistency.

#### Pre-commit Hooks

The following checks run on staged files before each commit:

- **Database Schema Check**: Validates Drizzle schema changes (`drizzle-kit check`) on `db/schema/*.ts`
- **Prettier**: Code formatting (`prettier --write`)
- **Oxlint**: Code linting with auto-fix
- **TODO/FIXME Check**: Warns about TODO/FIXME comments (non-blocking)

#### Pre-push Hooks

Pre-push hooks are currently disabled (commented out in `lefthook.yml`). Uncomment to enable if desired.

#### Bypassing Hooks

If you need to bypass hooks (use sparingly):

```bash
# Skip pre-commit hooks
git commit --no-verify

# Skip pre-push hooks
git push --no-verify
```

#### Manual Hook Execution

You can manually run hooks for testing:

```bash
# Run pre-commit checks
pnpx lefthook run pre-commit

# Run pre-push checks
pnpx lefthook run pre-push
```

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

1. Install dependencies

    ```bash
    pnpm install
    ```

2. Environment variables

    Copy `.env.example` to `.env.local` (already provided in the repo root):

    ```env
    NEXT_PUBLIC_DATABASE_URL=http://127.0.0.1:8080
    DATABASE_AUTH_TOKEN=
    # Optional: VERCEL_URL=your-vercel-deployment-url
    ```

3. Database (local libsql)

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

## Scripts

Common scripts (see `package.json`):

- `dev`, `build`, `start`
- `test`
- `db:local`, `dbg` (generate), `dbm` (migrate), `dbs` (studio), `dbup` (generate+migrate)
- `lint`, `format`, `typecheck` (lefthook-driven jobs)

## Notes

- The app reads database credentials from `NEXT_PUBLIC_DATABASE_URL` and `DATABASE_AUTH_TOKEN` (see `db/index.ts` and `drizzle.config.ts`).
- Better Auth trusted origins use `VERCEL_URL` in production if set.
