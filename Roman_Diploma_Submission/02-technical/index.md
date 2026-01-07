# 2. Technical Implementation

This section covers the technical architecture, design decisions, and implementation details of Automaspec.

## Contents

- [Tech Stack](tech-stack.md)
- [Deployment](deployment.md)

## Evaluation Criteria Documentation

| # | Criterion | Documentation |
|---|-----------|---------------|
| 1 | Business Analysis | [business-analysis.md](buisiness-analysis/business-analysis.md) |
| 2 | Backend Development | [backend.md](backend/backend.md) |
| 3 | Database Design | [databases.md](databases/databases.md) |
| 4 | Testing | [testing.md](qualiative-quantitive-testing/testing.md) |
| 5 | AI Assistant | [ai-assistant.md](ai-assistant/ai-assistant.md) |

## Solution Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                            Automaspec                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐     ┌────────────────────┐    ┌─────────────┐ │
│   │   Client    │────▶│ Next.js App Router │────▶│  libSQL DB  │ │
│   │ (Web UI)    │◀────│ (API + UI server)  │◀───│ (Turso)     │ │
│   └─────────────┘     └────────────────────┘    └─────────────┘ │
│         │                         │                              │
│         │                         ▼                              │
│         │                ┌────────────────┐                      │
│         │                │  External AI   │                      │
│         │                │  Providers     │                      │
│         │                └────────────────┘                      │
│         │                         │                              │
│         ▼                         ▼                              │
│   ┌───────────────────────────────────────────────────────────┐ │
│   │      Browser caching + React Query client-side cache      │ │
│   └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

The system is a single Next.js application that serves both the React UI and API endpoints. It uses oRPC-based contracts for typed server/client communication and persists data in a libSQL (Turso) database.

### System Components

| Component | Description | Technology |
|-----------|-------------|------------|
| **Frontend** | Browser-based dashboard for managing and analyzing test specifications | React 19 with Next.js app router, Tailwind CSS, Radix UI |
| **Backend** | Handles authentication, business logic, analytics aggregation, and AI-backed operations | Next.js server components, oRPC server |
| **Database** | Stores organizations, specs, runs, and analytics data | libSQL (Turso) accessed via Drizzle ORM |
| **Cache** | Client-side caching of queries and UI state | TanStack React Query, browser cache |
| **External Services** | AI model providers for analysis and suggestions | OpenRouter, Google AI (via ai-sdk) |

### Data Flow

```
[User Action] → [React UI] → [oRPC/HTTP Request] → [Next.js Backend]
                                                         │
                                                         ▼
                                                  [Business Logic]
                                                         │
                                                         ▼
                                                  [Drizzle ORM]
                                                         │
                                                         ▼
                                                   [libSQL DB]
                                                         │
                                                         ▼
                                                  [Aggregated Data]
                                                         │
                                                         ▼
[UI Update] ← [React UI] ← [Response/Streaming AI Output]
```

AI-related flows additionally call external providers through the `ai` SDK and provider-specific clients.

## Key Technical Decisions

| Decision | Rationale | Alternatives Considered |
|----------|-----------|------------------------|
| Next.js app router for full-stack app | Unified framework for SSR, routing, and API endpoints with strong DX | Separate React SPA + custom Node/Express backend, other meta-frameworks |
| Drizzle ORM with libSQL/Turso | Type-safe SQL, lightweight migrations, easy local and cloud setups | Prisma with Postgres, raw SQL on Postgres/MySQL |
| oRPC contracts for API surface | Strong typing end-to-end, auto-generated clients, OpenAPI integration | Ad-hoc REST endpoints without typed contracts |

## Security Overview

| Aspect | Implementation |
|--------|----------------|
| **Authentication** | Handled via better-auth on top of Next.js, session-based auth integrated with the app router |
| **Authorization** | Application-level checks around organizations and resources; routes and operations validated based on current session context |
| **Data Protection** | All external traffic is expected to run over HTTPS (TLS terminated by hosting), database credentials stored in environment variables |
| **Input Validation** | Zod schemas and oRPC contracts validate inputs and outputs at the boundary; Drizzle adds type-level guarantees for DB operations |
| **Secrets Management** | Secrets kept in environment variables on the host/CI (not in VCS); `.env` files are excluded from version control |
