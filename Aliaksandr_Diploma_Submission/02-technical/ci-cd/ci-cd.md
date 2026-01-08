# Criterion: CI/CD Pipeline

## Architecture Decision Record

### Status

**Status:** Accepted

**Date:** 2025-01-07

### Context

The project requires a robust CI/CD pipeline to ensure code quality, automate testing, and streamline deployment. The goal is to minimize manual operations, detect errors early, and maintain a high engineering culture. Continuous Integration (CI) and Continuous Deployment (CD) are essential for a modern full-stack application to ensure that every change is verified and ready for production.

### Decision

We have implemented a CI/CD pipeline using **GitHub Actions** for orchestration and **Vercel** for deployment (CD), supplemented by **Docker** for containerization references.

**Key Components:**
1.  **CI System:** GitHub Actions (native integration, extensive marketplace).
2.  **CD System:** Vercel (atomic deployments, automatic previews) and Docker (portability).
3.  **Quality Gates:** Linting (`oxlint`), Formatting (`oxfmt`), Type Checking (`tsc`), Unit Tests with **>70% coverage** (`Vitest`), and E2E Tests (`Playwright`).
4.  **Environments:**
    *   **Development:** Local development environment.
    *   **Preview/Test:** Individual preview deployments for every Pull Request.
    *   **Production:** Automated deployment to the main site on pushes to `main`.

### Alternatives Considered

| Alternative | Pros | Cons | Why Not Chosen |
|-------------|------|------|----------------|
| **GitLab CI** | Integrated with GitLab, powerful pipelines. | Repository is on GitHub. | Migration overhead not justified for the current setup. |
| **Jenkins** | Highly customizable, self-hosted. | Maintenance heavy, resource intensive. | Overkill for the current project scale; requires dedicated infrastructure. |
| **Manual VPS** | Full control over server. | Manual OS management, scaling complexity. | Vercel provides seamless Next.js integration and zero-config deployment. |

### Consequences

**Positive:**
-   **Automated Quality Gates:** Code cannot merge without passing all checks.
-   **Fast Feedback:** Automated testing catches regressions early.
-   **Zero-Downtime:** Atomic deployments ensure the site stays up during updates.
-   **Security:** Automated audits identify vulnerable dependencies.

**Negative:**
-   **Build Minutes:** Subject to GitHub Actions/Vercel usage limits.
-   **Vendor Dependence:** Reliance on Vercel's specialized Next.js features.

## Implementation Details

### Pipeline Architecture

**Diagram:**

![CI/CD Pipeline Diagram](../../assets/diagrams/ci-cd.png)

### What is Automated and Why?

| Stage | Automation | Rationale |
|-------|------------|-----------|
| **Verification** | Lint, Format, Types | Ensures code consistency and prevents common syntax/logic errors before they reach the build stage. |
| **Security** | `pnpm audit` | Automatically checks for known vulnerabilities. This is a separate blocking stage in the pipeline. |
| **Testing** | Unit & E2E | Guarantees that new features don't break existing functionality (regressions). |
| **Build** | `next build` | Verifies that the application can be compiled successfully for production. |
| **Deployment** | Vercel CD | Removes the risk of human error in manual file transfers and ensures a repeatable process. |

### Artifacts

The following artifacts are produced during the pipeline:
-   **Build Output:** Optimized standalone Next.js build located in `.next/standalone`.
-   **Docker Image:** A production-ready container image based on `node:24-alpine`.
-   **Test Reports:** Coverage reports and Playwright traces for debugging failures.

### Code Examples

**GitHub Actions Workflow (`.github/workflows/ci-cd.yml`):**
```yaml
name: CI/CD Pipeline
# ... (triggers) ...

jobs:
    security-audit:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v6.0.1
            - uses: pnpm/action-setup@v4.2.0
            - run: pnpm run ci
            - run: pnpm audit

    quality-checks:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v6.0.1
            - uses: pnpm/action-setup@v4.2.0
            - run: pnpm run ci
            - run: pnpm prepush # Runs types, 70% coverage tests, lint, format

    e2e-tests:
        needs: [quality-checks, security-audit]
        runs-on: ubuntu-latest
        # ... setup ...
        steps:
            - run: pnpm test:e2e

    deploy-production:
        needs: [quality-checks, security-audit, e2e-tests]
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
| 1 | **CI (Build + Tests)** | ✅ | Implemented via GitHub Actions with 3+ stages. |
| 2 | **Automated Trigger** | ✅ | Triggers on `push` and `pull_request`. |
| 3 | **Dependency Caching** | ✅ | Uses `actions/setup-node` with `pnpm` caching. |
| 4 | **Code Quality** | ✅ | Integrated `oxlint`, `oxfmt`, and `tsc` checks. |
| 5 | **Security Audit** | ✅ | `pnpm audit` runs on every CI cycle. |
| 6 | **Secrets Management** | ✅ | Uses GitHub Secrets for `VERCEL_TOKEN`. |
| 7 | **Artifacts** | ✅ | Generates Next.js standalone builds and Docker images. |
| 8 | **Environments** | ✅ | Supports Preview (PRs) and Production (Main). |
| 9 | **Failure Handling** | ✅ | Pipeline fails immediately on any error; deployment is blocked. |
| 10 | **CD Implementation** | ✅ | Fully automated deployment to Vercel/Docker environments. |


## References

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vercel Deployment Docs](https://vercel.com/docs/deployments/github)
- [Docker Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)
