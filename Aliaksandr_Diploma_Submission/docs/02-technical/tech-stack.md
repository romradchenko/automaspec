# Technology Stack

## Stack Overview

| Layer | Technology | Version | Justification |
|-------|------------|---------|---------------|
| **Frontend** | React | 19.2.3 | Mature ecosystem, SSR-ready, great DX with hooks and concurrent features. |
| **UI Framework** | Tailwind CSS + Radix UI Primitives | 4.1.18 / latest | Utility-first styling with accessible headless primitives; fast iteration and consistent design. |
| **Backend** | Node.js | - | Runtime for Next.js server components and API routes. |
| **Framework** | Next.js | 16.1.1 | Full‑stack React framework: app router, SSR/ISR, file routing, production-ready tooling. |
| **Database** | libSQL (Turso) | - | Lightweight, SQLite-compatible, serverless-friendly; simple ops with good dev ergonomics. |
| **ORM** | Drizzle ORM | 0.45.1 | Type‑safe SQL, lightweight migrations (`drizzle-kit`), excellent TS support. |
| **Cache** | None (client-side via TanStack Query) | - | Server cache not required yet; client state/query caching handles current needs. |
| **Message Queue** | None | - | Not needed at current scale and architecture. |
| **Deployment** | Docker + Docker Compose | - | Reproducible builds, parity across environments; Next.js standalone server. |
| **CI/CD** | Lefthook (Git hooks) + scripts | - | Enforce lint/format/tests locally; simple release flow with SemVer tags. |

## Key Technology Decisions

### Decision 1: Next.js as the full‑stack framework

**Context:** Need a unified stack for SSR/ISR, API routes, and modern React features with strong production tooling.

**Decision:** Use Next.js (app router) for both UI and server endpoints.

**Rationale:**
- First‑class SSR/ISR and routing with minimal boilerplate
- Strong DX: fast refresh, built‑in image/fonts, file‑based conventions
- Seamless React 19 features and ecosystem support

**Trade-offs:**
- Pros: Cohesive tooling, performance features out of the box, broad community
- Cons: Framework conventions and server actions have learning curve; some lock‑in compared to lighter frameworks

### Decision 2: Drizzle ORM + libSQL (Turso)

**Context:** Need a type‑safe, lightweight relational layer that is easy to operate and fits serverless-friendly workflows.

**Decision:** Use Drizzle ORM with libSQL (Turso) as the database.

**Rationale:**
- Type‑safe SQL with excellent TypeScript integration
- Simple, explicit migrations via `drizzle-kit`
- libSQL/Turso provides SQLite‑compatible, low‑ops hosting suitable for quick iteration

**Trade-offs:**
- Pros: Minimal overhead, fast local dev, strong typing
- Cons: Fewer advanced relational features than larger RDBMS; horizontal scaling patterns differ from Postgres/MySQL

## Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| **IDE** | VS Code | Recommended: Tailwind CSS IntelliSense, Vitest, Playwright, Docker extensions |
| **Version Control** | Git | Tags `vX.Y.Z` per SemVer policy; feature branches + PRs |
| **Package Manager** | pnpm | 10.27.0 |
| **Linting** | Oxlint | Type‑aware; deny warnings; autofix via scripts |
| **Formatting** | Oxfmt | Consistent formatting per repo style |
| **Testing** | Vitest + Testing Library + Playwright | Unit/integration with Vitest; E2E with Playwright; V8 coverage available |
| **API Documentation** | oRPC OpenAPI | Schemas and clients via `@orpc/*` packages |

## External Services & APIs

| Service | Purpose | Pricing Model |
|---------|---------|---------------|
| OpenRouter (LLM) | AI model routing/provider | Paid (free tier available) |
| Google AI (via `@ai-sdk/google`) | AI model provider | Paid (free tier available) |
| Turso (libSQL) | Managed libSQL database | Free tier available |
