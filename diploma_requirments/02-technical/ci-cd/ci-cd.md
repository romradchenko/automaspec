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
3.  **Quality Checks:**
    *   **Linting:** `oxlint` (via `pnpm lint`)
    *   **Formatting:** `oxfmt` (via `pnpm format`)
    *   **Type Checking:** `tsc` (via `pnpm typecheck`)
    *   **Unit Tests:** Vitest (via `pnpm test:coverage`)
    *   **E2E Tests:** Playwright (via `pnpm test:e2e`)
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

**Flow:**
`Code Push` -> `Quality Checks` -> `E2E Tests` -> `Deploy (Preview/Prod)`

**Diagram:**
![CI/CD Pipeline Diagram](../../assets/diagrams/ci-cd-pipeline.mermaid)

```mermaid
graph TD
    Start[Push / PR] --> QC_Start
    Start --> E2E_Start
    
    subgraph "Quality Checks Job"
        QC_Start[Start] --> QC_Install[Install Dependencies]
        QC_Install --> QC_Audit[Security Audit (pnpm audit)]
        QC_Install --> QC_PrePush[Lefthook: Lint, Format, Typecheck, Unit Tests]
    end
    
    subgraph "E2E Tests Job"
        E2E_Start[Start] --> E2E_Install[Install Dependencies]
        E2E_Install --> E2E_Setup[Setup Playwright]
        E2E_Setup --> E2E_Run[Run Playwright Tests]
    end
    
    QC_PrePush --> Join{Build Success?}
    E2E_Run --> Join
    
    Join -- Yes --> Branch{Branch?}
    
    Branch -- "PR (dev/main)" --> Preview[Deploy Preview (Vercel)]
    Branch -- "push (main)" --> Prod[Deploy Production (Vercel)]
```

### Key Implementation Decisions

| Decision | Rationale |
|----------|-----------|
| **GitHub Actions** | Native integration with the repository, free tier availability, and extensive marketplace actions. |
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
            - name: Run Security Audit
              run: pnpm audit
              continue-on-error: true
            - run: pnpm prepush # Runs types, tests, lint, format

    e2e-tests:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v6.0.1
            # ... setup ...
            - run: pnpm test:setup-playwright
            - run: pnpm test:e2e

    deploy-production:
        needs: [quality-checks, e2e-tests]
        if: github.ref == 'refs/heads/main'
        steps:
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
| 6 | **Automatic Trigger** | ✅ | Triggers on `push` to main and `pull_request`. |
| 7 | **Caching** | ✅ | `pnpm` cache configured in GitHub Actions setup. |
| 8 | **Secrets Management** | ✅ | Using `${{ secrets.VERCEL_TOKEN }}` and GitHub Secrets. |
| 9 | **Deploy Automation** | ✅ | Automatic deployment to Vercel on success. |
| 10 | **Failure Handling** | ✅ | Pipeline stops if quality checks or tests fail (`needs` specificed). |
| 11 | **Security Audit** | ✅ | `pnpm audit` added to `quality-checks` job. |

**Legend:**
- ✅ Fully implemented
- ⚠️ Partially implemented
- ❌ Not implemented

## Known Limitations

| Limitation | Impact | Potential Solution |
|------------|--------|-------------------|
| **Vercel Hobbies Limits** | Potential build timeout or bandwidth limits on free tier. | Upgrade to Pro or fallback to Docker-based self-hosting. |
| **No Static Security Scan** | Minor security risk from vulnerable packages. | Add `pnpm audit` step to `quality-checks` job. |

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Deployment Docs](https://vercel.com/docs/deployments/github)
- [Docker Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)
- Project Files: `.github/workflows/ci-cd.yml`, `Dockerfile`, `lefthook.yml`
