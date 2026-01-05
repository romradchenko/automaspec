# Criterion: CI/CD + Containerization

## Architecture Decision Record

### Status

**Status:** Accepted

**Date:** 2026-01-05

### Context

The project requires automated quality checks, testing, and deployment to ensure reliable releases. Additionally, containerization is needed for reproducible builds and deployment flexibility across environments.

### Decision

We implemented a comprehensive CI/CD infrastructure:

**CI/CD:**
- **Platform**: GitHub Actions
- **Deployment**: Vercel (preview + production)
- **Git Hooks**: Lefthook for pre-commit/pre-push checks

**Containerization:**
- **Runtime**: Docker with multi-stage builds
- **Orchestration**: Docker Compose (dev/prod profiles)
- **Base Image**: node:24-alpine

### Alternatives Considered

| Alternative | Pros | Cons | Why Not Chosen |
|-------------|------|------|----------------|
| GitLab CI | Integrated registry | Less GitHub integration | Team uses GitHub |
| Jenkins | Flexible, self-hosted | Complex setup, maintenance | GitHub Actions is simpler |
| Kubernetes | Production-grade | Overkill for this project | Docker Compose sufficient |

### Consequences

**Positive:**
- Automated quality gates prevent broken deployments
- Preview deployments enable stakeholder review
- Containerized builds ensure consistency

**Negative:**
- Vercel lock-in for deployment
- Docker adds complexity for local development

## Implementation Details

### CI Pipeline Stages

1. **Code Quality**: oxlint, oxfmt, DB schema validation
2. **Build**: pnpm install, Next.js build, type checking
3. **Testing**: Vitest unit/integration tests

### CD Pipeline

- **Preview**: Automatic on pull requests
- **Production**: On main branch after CI passes

### Docker Architecture

```dockerfile
# Multi-stage build
FROM node:24-alpine AS deps     # Dependencies
FROM node:24-alpine AS builder  # Build Next.js
FROM node:24-alpine AS runner   # Production runtime
```

### Container Security

| Feature | Implementation |
|---------|----------------|
| Non-root user | `nextjs` user in runtime |
| Secrets at runtime | Environment variables |
| Health checks | HTTP endpoint monitoring |

### Compose Profiles

| Profile | Use Case | Resource Limits |
|---------|----------|-----------------|
| `docker-compose.dev.yml` | Development | Lower limits |
| `docker-compose.prod.yml` | Production | Higher limits |

## Requirements Checklist

| # | Requirement | Status | Evidence/Notes |
|---|-------------|--------|----------------|
| 1 | Automated linting/formatting | ✅ | oxlint, oxfmt in CI |
| 2 | Automated testing | ✅ | Vitest in GitHub Actions |
| 3 | Preview deployments | ✅ | Vercel preview URLs |
| 4 | Production deployment | ✅ | Vercel production |
| 5 | Dockerfile | ✅ | Multi-stage, optimized |
| 6 | Docker Compose | ✅ | Dev and prod profiles |
| 7 | Health checks | ✅ | HTTP endpoint check |
| 8 | Non-root container | ✅ | `nextjs` user |

## References

- [CI/CD Report](../../../docs_requirments/ci-cd-infrastructure-report.md)
- [Containerization Report](../../../docs_requirments/containerization-requirements-report.md)
