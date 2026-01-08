# Criterion: CI/CD Pipeline

## Architecture Decision Record

### Status

**Status:** Accepted

**Date:** 2025-01-07

### Context

The project requires a robust CI/CD pipeline to ensure code quality, automate testing, and streamline deployment. The goal is to minimize manual operations, detect errors early, and maintain a high engineering culture. Key constraints include the need for automated testing (unit and e2e), code quality checks (linting, formatting), and deployment to a staging/production environment. The infrastructure should support containerization (Docker) and integrate with GitHub Actions.

### Decision

We have implemented a CI/CD pipeline using **GitHub Actions** for orchestration and **Vercel** for deployment (CD), supplemented by **Docker** for containerization references.

**Key Components:**
1.  **CI System:** GitHub Actions.
2.  **CD System:** Vercel (for Next.js frontend/backend) and Docker (for container portability).
3.  **Pipeline Jobs:**
    *   **Security Audit:** Separate job running `pnpm audit` to check for vulnerable dependencies.
    *   **Quality Checks:** Runs `pnpm quality-checks` which executes:
        - **Type Checking:** `tsc` (via `pnpm typecheck`)
        - **Unit Tests:** Vitest with coverage (via `pnpm test:coverage`)
        - **Linting:** `oxlint` (via `pnpm lint`)
        - **Formatting:** `oxfmt` (via `pnpm format`)
    *   **E2E Tests:** Playwright (via `pnpm test:e2e`) - depends on quality-checks and security-audit.
    *   **Deploy Preview:** Automatically deployed on Pull Requests to `dev` or `main`.
    *   **Deploy Production:** Automatically deployed on pushes to `main`.
4.  **Environments:**
    *   **Preview:** Automatically deployed on Pull Requests to `dev` or `main`.
    *   **Production:** Automatically deployed on pushes to `main`.

### Alternatives Considered

| Alternative | Pros | Cons | Why Not Chosen |
|-------------|------|------|----------------|
| **GitLab CI** | Integrated with GitLab, powerful pipelines. | Repository is on GitHub. | Migration overhead not justified. |
| **Jenkins** | Highly customizable, self-hosted. | Maintenance heavy, resource intensive. | Overkill for the current project scale. |
| **Self-Hosted VPS (CD)** | Full control over infrastructure. | Manual OS management, scaling complexity. | Vercel provides seamless Next.js integration and zero-config deployment. |

### Consequences

**Positive:**
-   **Automated Quality Gates:** Code cannot merge without passing lint, types, and tests.
-   **Fast Feedback:** E2E tests run automatically, catching integration issues early.
-   **Zero-Downtime Deployment:** Vercel handles atomic deployments.
-   **Reproducible Builds:** Dockerfile ensures consistency across environments.

**Negative:**
-   **Vendor Lock-in (Partial):** Heavy reliance on Vercel for the primary deployment flow.
-   **Build Minutes:** GitHub Actions limits on free tiers (though sufficient for current scale).

## Implementation Details

### Pipeline Architecture

The CI/CD pipeline consists of five main jobs that run in a specific order:

1. **Security Audit** and **Quality Checks** run in parallel (no dependencies)
2. **E2E Tests** depends on both Security Audit and Quality Checks completing successfully
3. **Deploy Preview** runs after E2E Tests for Pull Requests to `dev` or `main`
4. **Deploy Production** runs after E2E Tests for pushes to `main`

**Diagram:**

![CI/CD Pipeline Diagram](../../assets/diagrams/ci-cd.png)

### Key Implementation Decisions

| Decision | Rationale |
|----------|-----------|
| **GitHub Actions** | Native integration with the repository, free tier availability, and extensive marketplace actions. |
| **Separate Security Audit Job** | Runs in parallel with quality checks to provide faster feedback and independent failure handling. |
| **Quality Checks Aggregation** | Single `pnpm quality-checks` command runs typecheck, tests, lint, and format sequentially for consistency. |
| **E2E Tests Dependency** | E2E tests depend on both security audit and quality checks to ensure code quality before expensive integration tests. |
| **Vercel Deployment** | Native optimization for Next.js, providing automatic previews and production builds with zero config. |
| **Docker Multi-stage** | Used in `Dockerfile` to create lightweight, production-ready images (standalone mode) unrelated to Vercel if needed for alternative hosting. |
| **Lefthook** | Used for local pre-commit/pre-push hooks to save CI minutes by catching errors locally. |

### Code Examples

**CI/CD Workflow (`.github/workflows/ci-cd.yml`):**
```yaml
name: CI/CD Pipeline
on:
    pull_request:
        branches: [main, master, dev]
    push:
        branches: [main]

jobs:
    security-audit:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v6.0.1
            - uses: pnpm/action-setup@v4.2.0
            - uses: actions/setup-node@v6.1.0
              with:
                  node-version: '24'
                  cache: 'pnpm'
            - run: pnpm run ci
            - run: pnpm audit

    quality-checks:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v6.0.1
            - uses: pnpm/action-setup@v4.2.0
            - uses: actions/setup-node@v6.1.0
              with:
                  node-version: '24'
                  cache: 'pnpm'
            - run: pnpm run ci
            - run: pnpm quality-checks

    e2e-tests:
        needs: [quality-checks, security-audit]
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v6.0.1
            - uses: pnpm/action-setup@v4.2.0
            - uses: actions/setup-node@v6.1.0
              with:
                  node-version: '24'
                  cache: 'pnpm'
            - run: pnpm run ci
            - run: pnpm test:setup-playwright
            - run: pnpm test:e2e

    deploy-preview:
        needs: [quality-checks, security-audit, e2e-tests]
        if: |
            (github.event_name == 'pull_request' && github.base_ref == 'dev') ||
            (github.event_name == 'pull_request' && github.base_ref == 'main')
        steps:
            - uses: actions/checkout@v6.0.1
            - run: npm install --global vercel@latest
            - run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
            - run: vercel build --token=${{ secrets.VERCEL_TOKEN }}
            - run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}

    deploy-production:
        needs: [quality-checks, security-audit, e2e-tests]
        if: github.event_name == 'push' && github.ref == 'refs/heads/main'
        steps:
            - uses: actions/checkout@v6.0.1
            - run: npm install --global vercel@latest
            - run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
            - run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
            - run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

**Docker Configuration (`Dockerfile`):**
```dockerfile
# Multi-stage build for optimization
FROM node:24-alpine AS base
# ...
FROM base AS builder
RUN corepack enable pnpm && pnpm run build
# ...
FROM base AS runner
COPY --from=builder /app/.next/standalone ./
CMD ["node", "server.js"]
```

## Requirements Checklist

| # | Requirement | Status | Evidence/Notes |
|---|-------------|--------|----------------|
| 1 | **Code Checks** (Lint, Format) | ✅ | Implemented in `quality-checks` job using `oxlint` and `oxfmt`. |
| 2 | **Build Step** | ✅ | Implemented via `vercel build` and `docker build` (explicit in Dockerfile). |
| 3 | **Testing** (Unit & E2E) | ✅ | Unit tests (Vitest) in `quality-checks`, E2E (Playwright) in `e2e-tests` job. |
| 4 | **Artifacts** | ✅ | Docker Images (via Dockerfile), Vercel Build Artifacts. |
| 5 | **Environments** | ✅ | Dev/Preview (PRs) and Production (Main branch). |
| 6 | **Automatic Trigger** | ✅ | Triggers on `push` to main and `pull_request` to dev/main. |
| 7 | **Caching** | ✅ | `pnpm` cache configured in GitHub Actions setup. |
| 8 | **Secrets Management** | ✅ | Using `${{ secrets.VERCEL_TOKEN }}`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` and GitHub Secrets. |
| 9 | **Deploy Automation** | ✅ | Automatic deployment to Vercel on success (preview for PRs, production for main). |
| 10 | **Failure Handling** | ✅ | Pipeline stops if quality checks, security audit, or tests fail (`needs` specified). |
| 11 | **Security Audit** | ✅ | `pnpm audit` runs in separate `security-audit` job. |

**Legend:**
- ✅ Fully implemented
- ⚠️ Partially implemented
- ❌ Not implemented

## Known Limitations

| Limitation | Impact | Potential Solution |
|------------|--------|-------------------|
| **Vercel Hobbies Limits** | Potential build timeout or bandwidth limits on free tier. | Upgrade to Pro or fallback to Docker-based self-hosting. |
| **Production Deployment Commented** | Production deployment is currently commented out in workflow. | Uncomment `deploy-production` job when ready for production deployments. |

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Deployment Docs](https://vercel.com/docs/deployments/github)
- [Docker Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)
- Project Files: `.github/workflows/ci-cd.yml`, `Dockerfile`, `lefthook.yml`
