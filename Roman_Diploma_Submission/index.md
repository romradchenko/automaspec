# Automaspec

## Project Information

| Field | Value |
|-------|-------|
| **Student** | Roman Radchenko |
| **Group** | JS |
| **Supervisor** | Volha Kuzniatsova |
| **Date** | January 7, 2026 |

## Links

| Resource | URL |
|----------|-----|
| Production | [https://automaspec.vercel.app](https://automaspec.vercel.app) |
| Repository | [GitHub Repository](https://github.com/automaspec/automaspec) |
| API Docs | [https://automaspec.vercel.app/rpc/docs](https://automaspec.vercel.app/rpc/docs) |

## Elevator Pitch

Automaspec is an AI-powered test specification and automation platform that revolutionizes how development teams manage, document, and organize test cases. It targets QA engineers and developers who struggle with scattered test documentation across multiple tools, manual and time-consuming specification creation, and lack of visibility into test coverage. By combining an intelligent AI assistant for creating specifications and organizing test structure with a hierarchical specification management system and real-time CI/CD synchronization via GitHub Actions, Automaspec enables teams to create comprehensive test documentation 20-30% faster while maintaining a centralized, organized documentation hub.

## Evaluation Criteria Checklist

| # | Criterion | Status | Documentation |
|---|-----------|--------|---------------|
| 1 | Business Analysis | ✅ | [BA Documentation](02-technical/buisiness-analysis/business-analysis.md) |
| 2 | Backend Development | ✅ | [Backend Documentation](02-technical/backend/backend.md) |
| 3 | Database Design | ✅ | [Database Documentation](02-technical/databases/databases.md) |
| 4 | Qualitative/Quantitative Testing | ✅ | [Testing Documentation](02-technical/qualiative-quantitive-testing/testing.md) |
| 5 | AI Assistant / Chatbot | ✅ | [AI Documentation](02-technical/ai-assistant/ai-assistant.md) |
| 6 | Analytics & Reporting | ✅ | [Analytics Documentation](02-technical/analytics/analytics.md) |

## Documentation Navigation

- [Project Overview](01-project-overview/index.md) - Business context, goals, and requirements
- [Technical Implementation](02-technical/index.md) - Architecture, tech stack, and criteria details
- [User Guide](03-user-guide/index.md) - How to use the application
- [Retrospective](04-retrospective/index.md) - Lessons learned and future improvements

## Quick Reference

### Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TailwindCSS v4
- **Backend**: Next.js API Routes, oRPC (type-safe RPC)
- **Database**: Turso (distributed SQLite), Drizzle ORM
- **AI**: Vercel AI SDK with LLM integration
- **Authentication**: Better Auth with organizations plugin
- **Hosting**: Vercel (production), Docker containerization support
- **Testing**: Vitest, React Testing Library
- **CI/CD**: GitHub Actions

### Key Features

1. **Hierarchical Test Organization**: Folders → Specs → Requirements → Tests
2. **AI-Powered Test Generation**: Generate Vitest test code from natural language
3. **Multi-Organization Support**: Role-based access control (Owner, Admin, Member)
4. **CI/CD Integration**: GitHub Actions for automated test result synchronization
5. **Real-Time Status Tracking**: Test status visualization and aggregation
6. **Responsive UI**: Adaptive design for desktop, tablet, and mobile

---

*Document created: January 7, 2026*
*Last updated: January 7, 2026*
