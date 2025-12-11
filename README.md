# Automaspec

## Development

### Git Hooks

This project uses [Lefthook](https://lefthook.dev/) for managing git hooks to ensure code quality and consistency.

#### Pre-commit Hooks

The following checks run on staged files before each commit:

- **Database Schema Check**: Validates Drizzle schema changes (`drizzle-kit check`) on `db/schema/*.ts`
- **Prettier**: Code formatting (`prettier --write`)
- **Oxlint**: Code linting with auto-fix

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

    Copy `.env.example` to `.env.local` for local dev and to `.env` for Docker:

    ```env
    NEXT_PUBLIC_DATABASE_URL=https://your-cloud-libsql-endpoint
    DATABASE_AUTH_TOKEN=your-cloud-libsql-token
    # Optional: VERCEL_URL=your-vercel-deployment-url
    # Optional: OPENROUTER_API_KEY=...
    # Optional: GEMINI_API_KEY=...
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

## Containerization

- Copy `.env.example` to `.env` and set secrets before running containers.
- Start everything with `docker compose up --build`; stop with `docker compose down`.
- App listens on port `3000`; database is expected to be an external cloud libsql endpoint.

### Images

- `automaspec-web:local`: built from `Dockerfile` (multi-stage, non-root runtime).

### Environment variables

- `NEXT_PUBLIC_DATABASE_URL`: cloud libsql endpoint.
- `DATABASE_AUTH_TOKEN`: auth token for the cloud libsql endpoint.
- `OPENROUTER_API_KEY`: key for OpenRouter AI provider.
- `GEMINI_API_KEY`: key for Gemini AI provider.
- `VERCEL_URL`: optional host used by Better Auth for trusted origins.

### Container architecture

```
[browser] -> :3000 -> [automaspec-web] -> cloud libsql
```

### Resource requirements (min)

- App container: 1 CPU / 1.5 GB RAM.

## Scripts

Common scripts (see `package.json`):

- `dev`, `build`, `start`
- `test`
- `db:local`, `dbg` (generate), `dbm` (migrate), `dbs` (studio), `dbup` (generate+migrate)
- `lint`, `format`, `typecheck` (lefthook-driven jobs)

## Notes

- The app reads database credentials from `NEXT_PUBLIC_DATABASE_URL` and `DATABASE_AUTH_TOKEN` (see `db/index.ts` and `drizzle.config.ts`).
- Better Auth trusted origins use `VERCEL_URL` in production if set.
