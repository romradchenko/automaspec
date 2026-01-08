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

### Problem It Solves

Modern software teams struggle with test documentation scattered across multiple tools (Jira, Confluence, Excel, code comments), manual test creation that's time-consuming and error-prone, and a disconnect between test documentation and actual execution results. Automaspec addresses these challenges by providing a unified platform that automatically syncs test results from CI/CD pipelines, generates test code using AI, and provides real-time visibility into test coverage and status.

### Key Differentiators

- **AI-Powered Test Generation**: Leverages advanced language models to generate production-ready Vitest test code from natural language requirements
- **Real-Time CI/CD Sync**: Automatically updates test status from GitHub Actions, keeping documentation and reality in sync
- **End-to-End Traceability**: Links business requirements directly to test code and execution results, providing complete visibility
- **Adaptive Design**: Fully responsive interface that works seamlessly across desktop, tablet, and mobile devices
- **Type-Safe Architecture**: Built with TypeScript and oRPC for end-to-end type safety from database to UI

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

1.  **Unified Test Lifecycle**: Syncs code, tests, and requirements automatically. All test-related information lives in one place, eliminating the need to maintain documentation across multiple tools. Changes propagate automatically through the hierarchy, ensuring consistency.

2.  **Live Traceability**: Links business goals directly to passing/failing tests. Drill down from high-level requirements to specific test implementations and execution results. See at a glance which requirements are covered, which tests are failing, and where gaps exist.

3.  **AI Assistant**: Context-aware chatbot for test generation and debugging. The AI understands your existing test structure and generates code that follows your patterns and best practices. Review, edit, and iterate on generated tests with ease.

4.  **Adaptive Interface**: Fully responsive design for Desktop, Tablet, and Mobile. The interface adapts seamlessly to any screen size, providing an optimized experience whether you're at your desk or reviewing tests on your phone.

5.  **Secure Multi-Tenancy**: Organization-based access control with role-based permissions. Teams can collaborate securely with appropriate access levels while maintaining data isolation between organizations.

6.  **Analytics Dashboard**: Comprehensive metrics and visualizations for test coverage, pass/fail rates, and trends over time. Filter by time period, compare across periods, and gain data-driven insights into your testing efforts.

7.  **CI/CD Integration**: Automated synchronization with GitHub Actions ensures test execution results are automatically reflected in the platform. No manual updates required - when tests run in your CI pipeline, their status updates automatically.

---

*Document created: January 7, 2026*
*Last updated: January 7, 2026*
