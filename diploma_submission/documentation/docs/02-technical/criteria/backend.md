# Criterion: Backend

## Architecture Decision Record

### Status

**Status:** Accepted

**Date:** 2026-01-05

### Context

The backend needs to support a multi-tenant test management platform with secure authentication, type-safe APIs, real-time data operations, and seamless integration with AI providers. Key requirements include organization isolation, role-based access control, and efficient database queries.

### Decision

We implemented a layered architecture using:

- **Framework**: Next.js 16.1.1 (App Router) with TypeScript
- **RPC Framework**: oRPC v1.13.2 for type-safe API contracts
- **Authentication**: Better Auth v1.4.10 with organizations plugin
- **ORM**: Drizzle ORM v0.45.1 with Turso (SQLite)
- **Validation**: Zod v4.3.4 for schema validation
- **Logging**: Pino v10.1.0 for structured logging

### Alternatives Considered

| Alternative | Pros | Cons | Why Not Chosen |
|-------------|------|------|----------------|
| tRPC | Popular, mature | Less flexible, heavier bundle | oRPC has better OpenAPI support |
| Express.js | Simple, flexible | No type safety, separate server | Less integration with Next.js |
| Prisma ORM | Feature-rich | Heavier, slower cold starts | Drizzle is lighter, edge-compatible |

### Consequences

**Positive:**
- Full type safety from database to API client
- Automatic OpenAPI spec generation
- Edge-compatible with serverless deployment

**Negative:**
- Smaller community than tRPC/Prisma
- Learning curve for oRPC patterns

## Implementation Details

### Architecture

```
app/(backend)/rpc/[...all]/route.ts    <- Presentation Layer
    |
orpc/routes/*.ts                       <- Business Logic Layer
    |
orpc/contracts/*.ts                    <- Contract Layer
    |
db/schema/*.ts + Drizzle ORM           <- Data Access Layer
    |
Turso (SQLite)                         <- Database Layer
```

### Key Implementation Decisions

| Decision | Rationale |
|----------|-----------|
| oRPC over tRPC | Better OpenAPI generation, lighter bundle |
| Session-based auth | More secure than JWT for web apps |
| Organization middleware | Ensures data isolation per tenant |
| Cascading deletes | Maintains referential integrity |

### API Endpoints

| Category | Endpoints |
|----------|-----------|
| Test Management | CRUD for folders, specs, requirements, tests |
| Account Management | GDPR-compliant export and deletion |
| AI Assistant | Chat with tool-assisted actions |
| Analytics | Organization metrics aggregation |

## Requirements Checklist

| # | Requirement | Status | Evidence/Notes |
|---|-------------|--------|----------------|
| 1 | RESTful/RPC API architecture | ✅ | oRPC with OpenAPI spec |
| 2 | Authentication and authorization | ✅ | Better Auth + role-based access |
| 3 | Input validation | ✅ | Zod schemas on all endpoints |
| 4 | Error handling | ✅ | Structured oRPC errors |
| 5 | Database integration | ✅ | Drizzle ORM with migrations |
| 6 | Logging | ✅ | Pino structured logging |

## References

- [Backend Report](../../../docs_requirments/backend-report.md)
- API Entry: `app/(backend)/rpc/[...all]/route.ts`
