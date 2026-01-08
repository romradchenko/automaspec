# Automaspec

## Project Information

| Field | Value |
|-------|-------|
| **Student** | Aliaksandr Samatyia |
| **Group** | Js |
| **Supervisor** | Volha Kuznetsova |
| **Date** | January 7, 2026 |

## Links

| Resource | URL |
|----------|-----|
| Production | [https://automaspec.vercel.app](https://automaspec.vercel.app) |
| Repository | [GitHub Repository](https://github.com/qweered/automaspec) |
| API Docs | [https://automaspec.vercel.app/rpc/docs](https://automaspec.vercel.app/rpc/docs) |

## Elevator Pitch

Automaspec is an intelligent test management system that serves as the central nervous system for quality assurance. It unifies requirements, code, and test execution into a single source of truth. By syncing Playwright and Vitest results directly with business requirements and leveraging AI for test generation, Automaspec eliminates the fragmentation between what is expected (docs) and what is actually verified (code), enabling teams to ship with confidence and reduced manual overhead.

## Evaluation Criteria Checklist

| # | Criterion | Status | Documentation |
|---|-----------|--------|---------------|
| 1 | Front-End Configuration | ✅ | [Frontend Documentation](02-technical/frontend/frontend.md) |
| 2 | Adaptive UI | ✅ | [Adaptive UI Documentation](02-technical/adaptive-ui/adaptive-ui.md) |
| 3 | API Documentation | ✅ | [API Documentation](02-technical/api-documentation/api-documentation.md) |
| 4 | CI/CD Pipeline | ✅ | [CI/CD Documentation](02-technical/ci-cd/ci-cd.md) |
| 5 | Containerization | ✅ | [Containerization Documentation](02-technical/containerization/containerization.md) |
| 6 | Database Design | ✅ | [Database Schema](appendices/db-schema.md) |
| 7 | Deployment Strategy | ✅ | [Deployment Documentation](02-technical/deployment.md) |

## Documentation Navigation

- [Project Overview](01-project-overview/index.md) - Business context, goals, and stakeholders
- [Technical Implementation](02-technical/index.md) - Architecture, tech stack, and detailed criteria ADRs
- [User Guide](03-user-guide/index.md) - Manuals and workflows
- [Retrospective](04-retrospective/index.md) - Challenges and outcomes

## Quick Reference

### Tech Stack

- **Framework**: Next.js 16 (App Router), React 19
- **Language**: TypeScript
- **Database**: Turso (Distributed SQLite), Drizzle ORM
- **API**: oRPC (Type-safe contracts)
- **AI**: Vercel AI SDK (Google/OpenAI)
- **Testing**: Playwright (E2E) + Vitest (Unit)
- **Styling**: Tailwind CSS v4, Framer Motion
- **Hosting**: Vercel (Production), Docker (Local/Dev)
- **CI/CD**: GitHub Actions

### Key Features

1.  **Unified Test Lifecycle**: Syncs code, tests, and requirements automatically.
2.  **Live Traceability**: Links business goals directly to passing/failing tests.
3.  **AI Assistant**: Context-aware chatbot for test generation and debugging.
4.  **Adaptive Interface**: Fully responsive design for Desktop, Tablet, and Mobile.
5.  **Secure Multi-Tenancy**: Organization-based access control.

---

*Document created: January 7, 2026*
*Last updated: January 7, 2026*
