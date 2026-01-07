# Backend Development

## Architecture Decision Record

### Status

**Status:** Accepted

**Date:** 2025-10-15

### Context

The backend needs to support a modern web application with type-safe APIs, efficient database operations, secure authentication, and AI integration for test generation.

### Decision

Built using Next.js 16 with App Router, oRPC for type-safe RPC, Drizzle ORM for database access, and Better Auth for authentication.

### Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Framework | Next.js 16 (App Router) | Server-side rendering, API routes |
| API Layer | oRPC | Type-safe RPC with validation |
| Database | Turso (SQLite) + Drizzle ORM | Data persistence with type safety |
| Authentication | Better Auth | User auth with organizations plugin |
| AI Integration | Vercel AI SDK | LLM-powered test generation |
| Deployment | Vercel / Docker | Production hosting |

## Requirements Checklist

| # | Requirement | Status | Evidence/Notes |
|---|-------------|--------|----------------|
| 1 | Modern framework usage | ✅ | Next.js 16 with App Router |
| 2 | Database for data state | ✅ | Turso (distributed SQLite) |
| 3 | ORM usage | ✅ | Drizzle ORM for type-safe queries |
| 4 | Multi-layer architecture | ✅ | UI → API Routes → oRPC → DB layers |
| 5 | SOLID principles | ✅ | Functional approach, separation of concerns |
| 6 | API documentation | ✅ | oRPC with Scalar docs at `/rpc/docs` |
| 7 | Global error handling | ✅ | `global-error.tsx`, oRPC error middleware |
| 8 | Logging | ✅ | `lib/server-logger.ts` structured logging |
| 9 | Production deployment | ✅ | [https://automaspec.vercel.app](https://automaspec.vercel.app) |
| 10 | Test coverage ≥70% | ✅ | Unit tests with Vitest |
| 11 | No paid libraries | ✅ | All dependencies are open source |
| 12 | No vulnerable packages | ✅ | Regular security audits |
| 13 | Version control (Git) | ✅ | GitHub repository |
| 14 | JSON data format | ✅ | JSON for all API communication |
| 15 | Secrets in environment variables | ✅ | `.env` files, never in code |
| 16 | Auto-deploy from repository | ✅ | Vercel CI/CD integration |

## Project Structure

```
app/
├── (backend)/          # Backend API routes
│   └── rpc/            # oRPC endpoints
├── dashboard/          # Dashboard pages
├── login/              # Authentication pages
└── ...

orpc/                   # oRPC procedure definitions
├── index.ts            # Router composition
├── base.ts             # Base procedures with middleware
├── folders.ts          # Folder CRUD operations
├── specs.ts            # Spec operations
├── requirements.ts     # Requirement operations
├── tests.ts            # Test operations
└── ...

lib/
├── orpc/               # oRPC client setup
├── query/              # TanStack Query hooks
└── types.ts            # Shared type definitions

db/
├── schema/             # Drizzle schema definitions
├── migrations/         # Database migrations
└── index.ts            # Database connection
```

## Key Implementation Details

### Type-Safe API with oRPC

All API endpoints use oRPC for end-to-end type safety:
- Automatic input validation via Zod schemas
- Type inference for request/response
- Middleware for authentication and authorization

### Database Layer

- Drizzle ORM provides compile-time SQL type checking
- Migrations managed via Drizzle Kit
- Turso provides edge-distributed SQLite

### Authentication

- Better Auth handles user registration, login, sessions
- Organizations plugin for multi-tenant support
- Role-based access control (Owner, Admin, Member)

### Error Handling

- Centralized error handling via `global-error.tsx`
- oRPC middleware captures and formats errors
- Structured error responses with appropriate HTTP codes

## Security Measures

| Measure | Implementation |
|---------|----------------|
| Password hashing | bcrypt (via Better Auth) |
| Input validation | Zod schemas in oRPC |
| SQL injection protection | Parameterized queries (Drizzle ORM) |
| XSS protection | React's built-in escaping |
| HTTPS | Enforced in production |
| Rate limiting | API rate limits implemented |
| CORS | Configured for trusted origins |

## References

- [Requirements Document](../../../older_docs/Требования%20Backend%20(Рома).md)
- [oRPC Documentation](https://orpc.unnoq.com/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Better Auth Documentation](https://better-auth.com/)
