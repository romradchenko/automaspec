# Criterion: Database

## Architecture Decision Record

### Status

**Status:** Accepted

**Date:** 2026-01-05

### Context

The application requires a transactional database (OLTP) that supports multi-tenant data isolation, hierarchical relationships, and efficient CRUD operations. The database must be edge-compatible for serverless deployment and cost-effective for an MVP.

### Decision

We chose:

- **DBMS**: Turso (Distributed SQLite) via libsql
- **ORM**: Drizzle ORM v0.45.1
- **Migrations**: Drizzle Kit v0.31.8
- **Validation**: Zod via drizzle-zod

### Alternatives Considered

| Alternative | Pros | Cons | Why Not Chosen |
|-------------|------|------|----------------|
| PostgreSQL | Feature-rich, mature | Higher cost, heavier | Overkill for MVP |
| PlanetScale (MySQL) | Serverless, scalable | Higher cost, MySQL quirks | Turso is more cost-effective |
| Prisma ORM | Popular, feature-rich | Heavier, slower cold starts | Drizzle is lighter |

### Consequences

**Positive:**
- Edge distribution reduces latency globally
- Serverless-compatible with Vercel
- Free tier sufficient for MVP
- Full ACID transaction support

**Negative:**
- SQLite limitations for complex OLAP queries
- Smaller community than PostgreSQL

## Implementation Details

### ER Diagram

```
user ──< account
user ──< session
user ──< member >── organization
organization ──< invitation
organization ──< test_folder
organization ──< test_spec
test_folder ──< test_folder (self-referential)
test_folder ──< test_spec
test_spec ──< test_requirement
test_requirement ──< test
```

### Core Tables

| Table | Purpose |
|-------|---------|
| `user` | User accounts |
| `organization` | Multi-tenant workspaces |
| `member` | Organization membership with roles |
| `test_folder` | Hierarchical folder structure |
| `test_spec` | Test specifications |
| `test_requirement` | Requirements within specs |
| `test` | Individual test cases |

### Key Features

| Feature | Implementation |
|---------|----------------|
| Timestamps | Automatic `created_at`/`updated_at` via SQL defaults |
| Cascading deletes | Foreign key constraints with `ON DELETE CASCADE` |
| Organization isolation | All test data scoped by `organizationId` |
| Status aggregation | `testSpec.statuses` stores JSON counts |

### Schema Definition

```typescript
export const testSpec = sqliteTable('test_spec', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    folderId: text('folder_id').references(() => testFolder.id, { onDelete: 'cascade' }),
    organizationId: text('organization_id').notNull(),
    statuses: text('statuses', { mode: 'json' }),
    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`)
})
```

## Requirements Checklist

| # | Requirement | Status | Evidence/Notes |
|---|-------------|--------|----------------|
| 1 | OLTP database | ✅ | Turso (SQLite) for transactions |
| 2 | Normalized schema | ✅ | 3NF with proper relations |
| 3 | Foreign key constraints | ✅ | Cascading deletes |
| 4 | Migrations | ✅ | Drizzle Kit migrations |
| 5 | Type-safe queries | ✅ | Drizzle ORM + TypeScript |
| 6 | Multi-tenancy | ✅ | Organization-scoped data |

## Known Limitations

| Limitation | Impact | Potential Solution |
|------------|--------|-------------------|
| SQLite for OLAP | Complex analytics limited | Offload to analytics DB |

## References

- [Database Report](../../../docs_requirments/database-report.md)
- Schema: `db/schema/*.ts`
