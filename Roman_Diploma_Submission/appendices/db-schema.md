# Database Schema

## Overview

| Attribute | Value |
|-----------|-------|
| **Database** | [PostgreSQL/MySQL/MongoDB/etc.] |
| **Version** | [X.X] |
| **ORM** | [Prisma/TypeORM/Sequelize/etc.] |

## Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐
│     [Table1]    │       │     [Table2]    │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │───┐   │ id (PK)         │
│ [field]         │   │   │ [field]         │
│ [field]         │   └──▶│ [table1_id] (FK)│
│ created_at      │       │ created_at      │
└─────────────────┘       └─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│     [Table3]    │
├─────────────────┤
│ id (PK)         │
│ [table1_id] (FK)│
│ [field]         │
└─────────────────┘
```

[Or link to diagram in assets/diagrams/]

## Tables

### [Table 1]: [table_name]

[Description of what this table stores]

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Primary key |
| [column] | [VARCHAR(255)] | NOT NULL | [Description] |
| [column] | [TEXT] | NULLABLE | [Description] |
| [column] | [BOOLEAN] | DEFAULT false | [Description] |
| [foreign_id] | INTEGER | FK → [table.id] | [Description] |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | ON UPDATE NOW() | Last update timestamp |

**Indexes:**
- `idx_[table]_[column]` on `[column]`
- `idx_[table]_[column1]_[column2]` on `([column1], [column2])`

---

### [Table 2]: [table_name]

[Description of what this table stores]

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Primary key |
| [column] | [TYPE] | [CONSTRAINTS] | [Description] |
| [column] | [TYPE] | [CONSTRAINTS] | [Description] |

---

### [Table 3]: [table_name]

[Repeat pattern for each table]

## Relationships

| Relationship | Type | Description |
|--------------|------|-------------|
| [Table1] → [Table2] | One-to-Many | [Description] |
| [Table2] → [Table3] | Many-to-Many | [Through junction table] |
| [Table1] → [Table4] | One-to-One | [Description] |

## Migrations

| Version | Description | Date |
|---------|-------------|------|
| 001 | Initial schema | [Date] |
| 002 | [Change description] | [Date] |
| 003 | [Change description] | [Date] |

## Seeding

Test data available via:
```bash
npm run db:seed
# or
python manage.py seed
```
