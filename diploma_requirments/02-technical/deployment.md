# Deployment & DevOps

## Infrastructure

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Docker Host                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                Automaspec App Container             │   │
│   │  (Next.js server + React frontend, single image)    │   │
│   │                                                     │   │
│   │  Port: 3000 (HTTP)                                  │   │
│   └─────────────────────────────────────────────────────┘   │
│                     │                                       │
│                     ▼                                       │
│              ┌─────────────┐                               │
│              │   Turso /   │                               │
│              │  libSQL DB  │  (managed)                    │
│              └─────────────┘                               │
│                                                             │
└───────────────────────────┼─────────────────────────────────┘
                            │
                      [Internet]
```

The app is packaged as a single Next.js standalone container (runner stage). It connects over the internet to a managed libSQL (Turso) database.

### Environments

| Environment | URL | Branch |
|-------------|-----|--------|
| **Development** | http://localhost:3000 | feature/* |
| **Production** | [Deployed Docker host URL] | main |

There is no dedicated staging environment; production images are built from main and tagged using semantic versioning.

## CI/CD Pipeline

### Pipeline Overview

```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│  Commit  │──▶│  Lint    │──▶│  Test    │──▶│  Build  │
└──────────┘   └──────────┘   └──────────┘   └──────────┘
                                                 │
                                                 ▼
                                          ┌──────────┐
                                          │  Deploy  │
                                          │ (manual) │
                                          └──────────┘
```

Automated CI can run linting, tests, and Next.js builds, while deployment is performed manually using Docker images and docker-compose.

### Pipeline Steps

| Step | Tool | Actions |
|------|------|---------|
| **Build** | Node.js + pnpm + Next.js | Install dependencies and run `pnpm build` |
| **Lint** | Oxlint | Run `pnpm lint` to enforce code quality |
| **Format** | Oxfmt | Run `pnpm format` for consistent formatting |
| **Test** | Vitest + Playwright | Run `pnpm test` and `pnpm test:e2e` |
| **Docker Image** | Docker | Build standalone Next.js image via Dockerfile |
| **Deploy** | Docker Compose | Start/upgrade app using `docker-compose.prod.yml` |

### Pipeline Configuration

Example GitHub Actions workflow sketch:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm
      - run: corepack enable pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
```

## Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | libSQL/Turso database URL used by Drizzle | Yes | `libsql://<host>?authToken=...` |
| `DATABASE_AUTH_TOKEN` | Token for Turso/libSQL access | Yes | `***` (stored in secrets) |
| `NEXT_PUBLIC_DATABASE_URL` | Public base URL for DB (if exposed to client) | No | `https://...` |
| `NODE_ENV` | Environment mode | Yes | `development` / `production` |
| `PORT` | Application port | No | `3000` |

Secrets are stored outside the repo (for example, Docker host environment, docker-compose `.env`, or CI secret store). `.env` is not committed.

## How to Run Locally

### Prerequisites

- Node.js 24+
- pnpm (managed via corepack)
- Docker (optional, for container-based run)
- Access to a libSQL/Turso database (or compatible local instance)

### Setup Steps

```bash
# 1. Clone repository
git clone <repository-url>
cd automaspec

# 2. Install dependencies
corepack enable pnpm
pnpm install --frozen-lockfile

# 3. Configure environment variables
cp .env.example .env   # if available, otherwise create .env
# Set DATABASE_URL, DATABASE_AUTH_TOKEN, and other required vars

# 4. Run database migrations (if needed)
pnpm dbup

# 5. Start development server
pnpm dev
```

### Docker Setup (Alternative)

```bash
# Development Docker Compose
pnpm docker:dev:build
pnpm docker:dev:up

# Stop containers
pnpm docker:dev:down
```

For production-like runs on a server, use:

```bash
pnpm docker:prod:build
pnpm docker:prod:up
```

### Verify Installation

After starting the app (locally or via Docker):

1. Open http://localhost:3000
2. The Automaspec dashboard should load and display seeded or empty analytics/views
3. API and backend health can be inferred from successful page loads; a dedicated health endpoint can be added if required

## Monitoring & Logging

| Aspect | Tool | Dashboard URL |
|--------|------|---------------|
| **Application Logs** | Pino (structured logs), Docker logs | n/a (view via `docker logs` or hosting provider) |
| **Error Tracking** | Not yet integrated | - |
| **Performance** | Browser devtools, custom analytics | - |
| **Uptime** | Not yet integrated | - |
