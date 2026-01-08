# 1. Project Overview

This section provides the business context, goals, and requirements for Automaspec.

## Contents

- [Problem Statement & Goals](problem-and-goals.md)
- [Stakeholders Analysis](stakeholders.md)
- [Project Scope](scope.md)
- [Features & Requirements](features.md)

## Executive Summary

**Automaspec** is an AI-powered test specification and automation platform designed for QA engineers and developers. It addresses the fragmentation of test documentation across multiple tools and the time-consuming nature of manual test creation. The platform serves as a unified hub that bridges the gap between business requirements, test specifications, and actual test execution results, providing unprecedented visibility and traceability in the software testing lifecycle.

### Key Value Propositions

1. **Centralized Documentation** - Single source of truth for all test specifications with hierarchical organization. Eliminates the need to maintain test documentation across multiple tools like Jira, Confluence, Excel spreadsheets, or code comments. All test-related information lives in one place, making it easy to find, update, and maintain.

2. **AI-Powered Generation** - Generate Vitest test code from natural language requirements using advanced language models. The AI understands context from your existing test structure and generates production-ready test code that follows best practices. This dramatically reduces the time spent writing boilerplate test code while maintaining quality and consistency.

3. **Real-Time Visibility** - Track test status and coverage across the entire organization with live updates from CI/CD pipelines. See at a glance which requirements are covered by passing tests, which tests are failing, and where gaps exist in your test coverage. Aggregated metrics provide insights at the folder, spec, and organization levels.

4. **CI/CD Integration** - Automated synchronization with GitHub Actions ensures that test execution results are automatically reflected in the platform. No manual updates required - when tests run in your CI pipeline, their status updates automatically in Automaspec, keeping documentation and reality in sync.

5. **Multi-Tenant Collaboration** - Organization-based access control enables teams to collaborate securely. Role-based permissions (Owner, Admin, Member) ensure that team members have appropriate access levels while maintaining data isolation between organizations.

6. **Adaptive User Experience** - Fully responsive design that works seamlessly across desktop, tablet, and mobile devices. Whether you're reviewing test specs in the office or checking status on your phone, Automaspec provides a consistent, optimized experience.

### Target Users

| User Type | Primary Use Cases | Key Benefits |
|-----------|-------------------|--------------|
| **QA Engineers** | Create specs, define requirements, review tests, track coverage | Centralized test documentation, AI-assisted test creation, real-time status tracking |
| **Developers** | Generate tests, export code, track status, integrate with CI/CD | Fast test generation, code export capabilities, automated status sync |
| **Team Leads** | Manage organizations, view reports, oversee coverage, invite team members | Organization-wide visibility, analytics dashboards, team collaboration tools |
| **Product Managers** | Review test coverage, understand quality metrics, track requirement fulfillment | High-level dashboards, requirement traceability, quality insights |

### Technology Foundation

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TailwindCSS v4 |
| Backend | oRPC, Drizzle ORM |
| Database | Turso (distributed SQLite) |
| AI | Vercel AI SDK, OpenRouter, Gemini |
| Auth | Better Auth with organizations |
| Hosting | Vercel, Docker support |

## Quick Links

- **Production**: [https://automaspec.vercel.app](https://automaspec.vercel.app)
- **API Docs**: [https://automaspec.vercel.app/rpc/docs](https://automaspec.vercel.app/rpc/docs)
- **Full BA Report**: [BA Report](../../older_docs/ba-report.md)
