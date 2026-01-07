# Database Design

## Architecture Decision Record

### Status

**Status:** Accepted

**Date:** 2025-10-15

### Context

The application requires a database solution that supports:
- Multi-tenant organization structure
- Hierarchical test specification data
- User authentication and sessions
- Fast read operations for dashboard views
- Cost-effective hosting

### Decision

Using Turso (distributed SQLite) with Drizzle ORM for type-safe database operations and automatic migrations.

### Alternatives Considered

| Alternative | Pros | Cons | Why Not Chosen |
|-------------|------|------|----------------|
| PostgreSQL | More features, widely adopted | Hosting costs, setup complexity | Budget constraints for MVP |
| MongoDB | Flexible schema, document model | No type safety, harder joins | Hierarchical data needs relations |
| Supabase | Postgres + realtime | Vendor lock-in, costs | Turso provides edge distribution |

## Requirements Checklist

| # | Requirement | Status | Evidence/Notes |
|---|-------------|--------|----------------|
| 1 | Data dictionary | ✅ | Schema files in `db/schema/` |
| 2 | Data integrity description | ✅ | Foreign keys, constraints defined |
| 3 | Logical schema visualization | ✅ | [DB Schema](../../appendices/db-schema.md) |
| 4 | DDL script / migrations | ✅ | `db/migrations/` directory |
| 5 | Modern RDBMS | ✅ | Turso (distributed SQLite) |
| 6 | Normalization (3NF) | ✅ | Proper table decomposition |
| 7 | Primary & foreign keys | ✅ | Defined in all tables |
| 8 | Constraints (NOT NULL, UNIQUE) | ✅ | Applied where appropriate |
| 9 | Proper data types | ✅ | TEXT, INTEGER, timestamps |
| 10 | Migrations in version control | ✅ | Git-tracked migrations |
| 11 | Test data for demo | ✅ | `sample_data.sql` available |
| 12 | Role-based access | ✅ | Organization roles (owner, admin, member) |
| 13 | Encrypted passwords | ✅ | bcrypt hashing via Better Auth |

## Database Schema

### Core Tables

| Table | Description |
|-------|-------------|
| `user` | User accounts with authentication data |
| `session` | Active user sessions |
| `account` | OAuth/credential accounts linked to users |
| `organization` | Multi-tenant organizations |
| `member` | Organization membership with roles |
| `invitation` | Pending organization invitations |
| `folder` | Hierarchical folder structure |
| `spec` | Test specifications within folders |
| `requirement` | Requirements within specs |
| `test` | Individual tests within requirements |

### Entity Relationships

```
organization (1) ─────< (N) member (N) >───── (1) user
      │
      │ (1)
      │
      ▼
      (N)
   folder ─────< (N) folder (self-referential for nesting)
      │
      │ (1)
      │
      ▼
      (N)
    spec
      │
      │ (1)
      │
      ▼
      (N)
  requirement
      │
      │ (1)
      │
      ▼
      (N)
    test
```

### Key Schema Features

**Organizations & Members:**
- Multi-tenant isolation via `organization_id`
- Role-based access: `owner`, `admin`, `member`
- Invitation system for onboarding

**Hierarchical Structure:**
- Folders support unlimited nesting via `parent_id`
- Specs belong to folders
- Requirements belong to specs
- Tests belong to requirements

**Automatic Timestamps:**
- `created_at` and `updated_at` handled at database level
- No manual timestamp management required

## Migration Strategy

Migrations are managed via Drizzle Kit:

```bash
pnpm dbg   # Generate migration from schema changes
pnpm dbm   # Apply migrations
pnpm dbs   # Open Drizzle Studio
```

All migrations are SQL files stored in `db/migrations/` and tracked in Git.

## Data Integrity

| Constraint Type | Application |
|-----------------|-------------|
| Primary Keys | All tables have unique IDs |
| Foreign Keys | Cascade deletes where appropriate |
| NOT NULL | Required fields enforced |
| UNIQUE | Emails, organization names |
| CHECK | Status enums, role validation |

## Performance Considerations

- Indexes on frequently queried columns
- Turso edge replication for read scalability
- Connection pooling via libSQL client
- Optimized queries via Drizzle ORM

## References

- [Requirements Document](../../../older_docs/Требования%20Базы%20данных%20(Рома).md)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Turso Documentation](https://docs.turso.tech/)
- [Schema Files](../../../db/schema/)
