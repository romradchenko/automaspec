# Automaspec — Containerization Requirements (Checklist)

This document summarizes the required containerization artifacts and how they are satisfied in the current repository.

## 1. Required Artifacts

- `Dockerfile` (multi-stage build, production runner)
- `.dockerignore` (excludes heavy/unneeded files from build context)
- `docker-compose.dev.yml` (development container run configuration)
- `docker-compose.prod.yml` (production-like container run configuration)
- `.env.example` (documented runtime configuration variables)

## 2. Dockerfile Requirements

- Multi-stage build (`base` → `deps` → `builder` → `runner`)
- Uses `pnpm` via Corepack for deterministic installs
- Produces a minimal runtime image (Next.js standalone output)
- Runs as non-root user in the `runner` stage
- Exposes and health-checks the configured `PORT` (default `3000`)

## 3. Compose Requirements

- Single service (`app`) with port mapping `${PORT:-3000}:${PORT:-3000}`
- Loads runtime configuration from `.env` via `env_file`
- Includes a simple HTTP healthcheck
- Uses a bridge network (`automaspec-network`)

Notes:

- The database is an external libSQL/Turso endpoint (no DB container is required).

## 4. Environment Configuration

Minimum required:

- `NEXT_PUBLIC_DATABASE_URL`
- `DATABASE_AUTH_TOKEN`

Optional (feature-dependent):

- `OPENROUTER_API_KEY` (AI provider)
- `GEMINI_API_KEY` (AI provider)
- `VERCEL_URL` (Better Auth trusted origins in some deployments)

## 5. Local Validation Steps

From repository root:

- Development-style run: `pnpm docker:dev:up`
- Production-style run: `pnpm docker:prod:up`
- Stop containers: `pnpm docker:dev:down` / `pnpm docker:prod:down`

Then verify:

- App responds on `http://localhost:3000`
- Healthcheck passes
- App can connect to the configured libSQL endpoint via the provided env vars

