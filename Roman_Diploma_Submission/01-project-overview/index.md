# 1. Project Overview

This section provides the business context, goals, and requirements for Automaspec.

## Contents

- [Problem Statement & Goals](problem-and-goals.md)
- [Stakeholders Analysis](stakeholders.md)
- [Project Scope](scope.md)
- [Features & Requirements](features.md)

## Executive Summary

**Automaspec** is an AI-powered test specification and automation platform designed for QA engineers and developers. It addresses the fragmentation of test documentation across multiple tools and the time-consuming nature of manual test creation.

### Key Value Propositions

1. **Centralized Documentation** - Single source of truth for all test specifications with hierarchical organization
2. **AI-Powered Generation** - Generate Vitest test code from natural language requirements
3. **Real-Time Visibility** - Track test status and coverage across the entire organization
4. **CI/CD Integration** - Automated synchronization with GitHub Actions

### Target Users

| User Type | Primary Use Cases |
|-----------|-------------------|
| QA Engineers | Create specs, define requirements, review tests |
| Developers | Generate tests, export code, track status |
| Team Leads | Manage organizations, view reports, oversee coverage |

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
