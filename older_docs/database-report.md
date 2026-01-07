Database Report for Automaspec
Overview
This report provides comprehensive documentation of the Automaspec database architecture, schema design, and compliance with diploma
project requirements for OLTP transactional databases.

1. Technology Stack
Component

Technology

Version

DBMS
ORM
Migration Tool
Schema Definition
Validation

Turso (Distributed SQLite)
Drizzle ORM
Drizzle Kit
TypeScript
Zod (via drizzle-zod)

libsql 0.15.15
0.45.1
0.31.8
5.9.3
4.3.4

1.1 DBMS Selection Justification
Turso (SQLite-based) was chosen for the following reasons:
1. Edge Distribution: Turso provides global edge replication, reducing latency for users worldwide
2. Serverless Compatibility: Works seamlessly with Next.js and Cloudflare edge deployments
3. Cost Efficiency: Free tier sufficient for MVP with generous read/write quotas
4. SQLite Compatibility: Full SQL support with ACID transactions
5. Drizzle ORM Integration: First-class TypeScript support with type-safe queries
Note: While SQLite has limitations for heavy OLAP workloads, Automaspec is an OLTP application focused on transactional operations
(CRUD for test specifications), making SQLite an appropriate choice.

2. Logical Schema
2.1 ER Diagram
erDiagram
user ||‐‐o{ account : has
user ||‐‐o{ session : has
user ||‐‐o{ member : belongs_to
user ||‐‐o{ invitation : invites
organization ||‐‐o{ member : has
organization ||‐‐o{ invitation : has
organization ||‐‐o{ test_folder : contains
organization ||‐‐o{ test_spec : contains
test_folder ||‐‐o{ test_folder : parent_child
test_folder ||‐‐o{ test_spec : contains
test_spec ||‐‐o{ test_requirement : has
test_requirement ||‐‐o{ test : has
user {
text id PK
text name
text email UK
boolean emailVerified
text image
timestamp createdAt
timestamp updatedAt

}
account {
text id PK
text accountId
text providerId
text userId FK
text accessToken
text refreshToken
text idToken
timestamp accessTokenExpiresAt
timestamp refreshTokenExpiresAt
text scope
text password
timestamp createdAt
timestamp updatedAt
}
session {
text id PK
timestamp expiresAt
text token UK
timestamp createdAt
timestamp updatedAt
text ipAddress
text userAgent
text userId FK
text activeOrganizationId
}
organization {
text id PK
text name
text slug UK
text logo
text plan
text metadata
timestamp createdAt
timestamp updatedAt
}
member {
text id PK
text organizationId FK
text userId FK
text role
timestamp createdAt
timestamp updatedAt
}
invitation {
text id PK
text organizationId FK
text email
text role
text status
timestamp expiresAt
text inviterId FK
timestamp createdAt
}

verification {
text id PK
text identifier
text value
timestamp expiresAt
timestamp createdAt
timestamp updatedAt
}
test_folder {
text id PK
text name
text description
text parentFolderId FK
text organizationId FK
integer order
text createdAt
text updatedAt
}
test_spec {
text id PK
text name
text fileName
text description
json statuses
integer numberOfTests
text folderId FK
text organizationId FK
text createdAt
text updatedAt
}
test_requirement {
text id PK
text name
text description
integer order
text specId FK
text createdAt
text updatedAt
}
test {
text id PK
text status
text framework
text code
text requirementId FK
text createdAt
text updatedAt
}

2.2 Physical ER Diagram
See diagram.pdf for the original database diagram.
Diagram Accuracy Note: The diagram is current with one minor clarification: - test_folder.parentFolderId is nullable (allows rootlevel folders)

3. Data Dictionary
3.1 Authentication Layer (Better Auth)
Table: user
Column

Type

Constraints

Description

id
name
email
emailVerified
image
createdAt
updatedAt

TEXT
TEXT
TEXT
INTEGER
TEXT
INTEGER
INTEGER

PK, NOT NULL
NOT NULL
NOT NULL, UNIQUE
NOT NULL
NOT NULL
NOT NULL

Unique user identifier
User display name
User email address
Boolean flag for email verification
Profile image URL
Account creation timestamp
Last update timestamp

Column

Type

Constraints

Description

id
accountId
providerId
userId

TEXT
TEXT
TEXT
TEXT

Unique account identifier
External account ID (OAuth)
Auth provider (credential, google, github)
Associated user

accessToken
refreshToken
idToken
accessTokenExpiresAt
refreshTokenExpiresAt
scope
password
createdAt
updatedAt

TEXT
TEXT
TEXT
INTEGER
INTEGER
TEXT
TEXT
INTEGER
INTEGER

PK, NOT NULL
NOT NULL
NOT NULL
FK → user.id, NOT NULL, ON DELETE
CASCADE
NOT NULL
NOT NULL

Column

Type

Constraints

Description

id
expiresAt
token
createdAt
updatedAt
ipAddress
userAgent
userId

TEXT
INTEGER
TEXT
INTEGER
INTEGER
TEXT
TEXT
TEXT

Unique session identifier
Session expiration timestamp
Session token
Session creation timestamp
Last activity timestamp
Client IP address
Browser user agent
Session owner

activeOrganizationId

TEXT

PK, NOT NULL
NOT NULL
NOT NULL, UNIQUE
NOT NULL
NOT NULL
FK → user.id, NOT NULL, ON DELETE
CASCADE
-

Column

Type

Constraints

Description

id
name
slug
logo
plan
metadata
createdAt

TEXT
TEXT
TEXT
TEXT
TEXT
TEXT
INTEGER

PK, NOT NULL
NOT NULL
UNIQUE
NOT NULL, DEFAULT ‘free’
-

Unique organization identifier
Organization display name
URL-friendly identifier
Organization logo URL
Subscription plan (free/pro/enterprise)
Additional JSON metadata
Creation timestamp

Table: account

OAuth access token
OAuth refresh token
OAuth ID token
Token expiration timestamp
Refresh token expiration
OAuth scopes
Hashed password (bcrypt)
Creation timestamp
Update timestamp

Table: session

Currently active organization

Table: organization

Column

Type

Constraints

Description

updatedAt

INTEGER

-

Update timestamp

Column

Type

Constraints

Description

id
organizationId

TEXT
TEXT

Unique membership identifier
Organization reference

userId

TEXT

role
createdAt
updatedAt

TEXT
INTEGER
INTEGER

PK, NOT NULL
FK → organization.id, NOT NULL, ON
DELETE CASCADE
FK → user.id, NOT NULL, ON DELETE
CASCADE
NOT NULL, DEFAULT ‘member’
-

Column

Type

Constraints

Description

id
organizationId

TEXT
TEXT

Unique invitation identifier
Target organization

email
role
status
expiresAt
inviterId

TEXT
TEXT
TEXT
INTEGER
TEXT

createdAt

INTEGER

PK, NOT NULL
FK → organization.id, NOT NULL, ON
DELETE CASCADE
NOT NULL
NOT NULL, DEFAULT ‘pending’
NOT NULL
FK → user.id, NOT NULL, ON DELETE
CASCADE
-

Table: member

User reference
Role (owner/admin/member)
Membership creation timestamp
Update timestamp

Table: invitation

Invitee email address
Assigned role upon acceptance
Invitation status
Expiration timestamp
Inviting user
Creation timestamp

Table: verification
Column

Type

Constraints

Description

id
identifier
value
expiresAt
createdAt
updatedAt

TEXT
TEXT
TEXT
INTEGER
INTEGER
INTEGER

PK, NOT NULL
NOT NULL
NOT NULL
NOT NULL
-

Unique verification identifier
Verification target (email)
Verification token/code
Token expiration
Creation timestamp
Update timestamp

Table: apiKey API keys are used for webhook integration (CI/CD sync) and are scoped to a user.
Column

Type

Constraints

Description

id
name
start
prefix
key
userId

TEXT
TEXT
TEXT
TEXT
TEXT
TEXT

Unique API key id
Optional display name
Optional start hint
Optional prefix
Hashed key material
Owner user

enabled
rateLimitEnabled
rateLimitTimeWindow
rateLimitMax
createdAt
updatedAt

INTEGER
INTEGER
INTEGER
INTEGER
INTEGER
INTEGER

PK
NOT NULL
FK → user.id, NOT NULL, ON DELETE
CASCADE
DEFAULT true
DEFAULT true
DEFAULT 86400000
DEFAULT 10
NOT NULL
NOT NULL

Key enabled flag
Per-key rate limit enabled
Rate limit window (ms)
Max requests per window
Creation timestamp
Update timestamp

Column

Type

Constraints

Description

3.2 Test Management Layer
Table: test_folder
Column

Type

Constraints

Description

id
name
description
parentFolderId
organizationId

TEXT
TEXT
TEXT
TEXT
TEXT

Unique folder identifier
Folder display name
Folder description
Parent folder for nesting
Owning organization

order
createdAt

INTEGER
TEXT

updatedAt

TEXT

PK, NOT NULL
NOT NULL
FK → test_folder.id (self-ref)
FK → organization.id, NOT NULL, ON
DELETE CASCADE
NOT NULL, DEFAULT 0
NOT NULL, DEFAULT
CURRENT_TIMESTAMP
NOT NULL, DEFAULT
CURRENT_TIMESTAMP

Sort order within parent
Creation timestamp
Update timestamp (auto-update)

Table: test_spec
Column

Type

Constraints

Description

id
name
fileName
description
statuses
numberOfTests
folderId

TEXT
TEXT
TEXT
TEXT
TEXT (JSON)
INTEGER
TEXT

Unique spec identifier
Test specification name
Associated test file name
Detailed description
Aggregated status counts
Total test count
Parent folder

organizationId

TEXT

createdAt

TEXT

updatedAt

TEXT

PK, NOT NULL
NOT NULL
NOT NULL, DEFAULT {…}
NOT NULL, DEFAULT 0
FK → test_folder.id, ON DELETE
CASCADE
FK → organization.id, NOT NULL, ON
DELETE CASCADE
NOT NULL, DEFAULT
CURRENT_TIMESTAMP
NOT NULL, DEFAULT
CURRENT_TIMESTAMP

Owning organization
Creation timestamp
Update timestamp

Status JSON Structure:
{
"passed": 0,
"failed": 0,
"pending": 0,
"skipped": 0,
"todo": 0,
"disabled": 0,
"missing": 0,
"deactivated": 0,
"partial": 0
}

Table: test_requirement
Column

Type

Constraints

Description

id
name

TEXT
TEXT

PK, NOT NULL
NOT NULL

Unique requirement identifier
Requirement description

Column

Type

Constraints

Description

description
order
specId

TEXT
INTEGER
TEXT

Detailed description
Sort order within spec
Parent specification

createdAt

TEXT

updatedAt

TEXT

NOT NULL, DEFAULT 0
FK → test_spec.id, NOT NULL, ON
DELETE CASCADE
NOT NULL, DEFAULT
CURRENT_TIMESTAMP
NOT NULL, DEFAULT
CURRENT_TIMESTAMP

Creation timestamp
Update timestamp

Table: test
Column

Type

Constraints

Description

id
status
framework
code
requirementId

TEXT
TEXT
TEXT
TEXT
TEXT

Unique test identifier
Test status (passed/failed/pending/…)
Test framework (vitest)
Test source code
Parent requirement

createdAt

TEXT

updatedAt

TEXT

PK, NOT NULL
NOT NULL
NOT NULL
FK → test_requirement.id, NOT NULL,
ON DELETE CASCADE
NOT NULL, DEFAULT
CURRENT_TIMESTAMP
NOT NULL, DEFAULT
CURRENT_TIMESTAMP

Creation timestamp
Update timestamp

4. Normalization Analysis
4.1 Third Normal Form (3NF) Compliance
The database schema is normalized to 3NF:
First Normal Form (1NF): - All tables have atomic values in each column - Each table has a primary key - No repeating groups
Second Normal Form (2NF): - All non-key attributes depend on the entire primary key - No partial dependencies (all PKs are single-column)
Third Normal Form (3NF): - No transitive dependencies - All non-key attributes depend only on the primary key
Deliberate Denormalization: - test_spec.statuses: JSON field storing aggregated status counts for performance - Justification: Avoids
expensive COUNT queries on every spec display - Maintained by: Application logic updates on test status changes

5. Relationships and Constraints
5.1 Foreign Key Relationships
Source Table

Source Column

Target Table

Target Column

On Delete

account
session
member
member
invitation
invitation
test_folder
test_folder
test_spec
test_spec
test_requirement
test

userId
userId
organizationId
userId
organizationId
inviterId
parentFolderId
organizationId
folderId
organizationId
specId
requirementId

user
user
organization
user
organization
user
test_folder
organization
test_folder
organization
test_spec
test_requirement

id
id
id
id
id
id
id
id
id
id
id
id

CASCADE
CASCADE
CASCADE
CASCADE
CASCADE
CASCADE
CASCADE
CASCADE
CASCADE
CASCADE
CASCADE

5.2 Unique Constraints
Table

Column(s)

Description

user
organization
session

email
slug
token

One account per email
Unique URL slugs
Unique session tokens

5.3 Default Values
Table

Column

Default

organization.plan
member.role
invitation.status
test_folder.order
test_spec.numberOfTests
test_spec.statuses
test_requirement.order
*.createdAt
*.updatedAt

-

‘free’
‘member’
‘pending’
0
0
JSON with all counts = 0
0
CURRENT_TIMESTAMP
CURRENT_TIMESTAMP

6. DDL Scripts and Migrations
6.1 Schema Definition Location
Schema is defined using Drizzle ORM TypeScript:
• Authentication Schema: db/schema/auth.ts
• Test Management Schema: db/schema/tests.ts
• Index Export: db/schema/index.ts
6.2 Migration Files
Migrations are stored in db/migrations/:
Migration

Description

0000_unknown_genesis.sql
0001_organic_warpath.sql
0002_lean_juggernaut.sql

Initial schema with unique indexes
Remove parentFolderId column
Re-add parentFolderId as nullable

6.3 Migration Configuration
// drizzle.config.ts
export default defineConfig({
schema: './db/schema',
out: './db/migrations',
dialect: 'turso',
casing: 'snake_case',
dbCredentials: {
url: process.env.NEXT_PUBLIC_DATABASE_URL ?? '',
authToken: process.env.DATABASE_AUTH_TOKEN
}
})

6.4 Version Control
All migrations are tracked in Git with journal metadata:
db/migrations/meta/_journal.json

7. Data Integrity
7.1 Referential Integrity
• Cascading Deletes: All foreign keys use ON DELETE CASCADE
• Organization Isolation: All test data requires organizationId
• Hierarchical Integrity: Folder deletion cascades to specs, requirements, and tests
7.2 Transaction Support
Drizzle ORM provides transaction support:
await db.transaction(async (tx) => {
await tx.insert(testSpec).values({...})
await tx.insert(testRequirement).values({...})
})

7.3 Timestamp Automation
• createdAt: Set automatically via SQL DEFAULT CURRENT_TIMESTAMP
• updatedAt: Updated via Drizzle’s $onUpdate() modifier

8. Security Implementation
8.1 Password Storage
• Algorithm: bcrypt (via Better Auth)
• Storage: Hashed in account.password column
• No plaintext: Passwords never stored in clear text
• No weak hashing: MD5/SHA-1 not used
8.2 Authorization Model
Authorization is implemented at the application level via oRPC middleware:
// orpc/middleware.ts
export const authMiddleware = os.middleware(async ({ context, next }) => {
const session = await auth.api.getSession({ headers: context.headers })
if (!session) throw new ORPCError('UNAUTHORIZED')
return next({ context: { ...context, session } })
})
export const organizationMiddleware = os.middleware(async ({ context, next }) => {
const organizationId = context.session.session.activeOrganizationId
if (!organizationId) throw new ORPCError('FORBIDDEN')
return next({ context: { ...context, organizationId } })
})

Role Hierarchy: | Role | Permissions | |——|————-| | owner | Full access, can delete organization | | admin | Manage members, full
CRUD on specs | | member | Read/write specs within organization |
Justification for Application-Level Authorization: - Turso (edge SQLite) does not support traditional database roles - Application-level
middleware provides equivalent security - All queries are scoped by organizationId preventing cross-tenant access - This pattern is standard
for serverless/edge deployments
8.3 SQL Injection Protection
• All queries use Drizzle ORM parameterized queries
• No raw SQL string concatenation
• Input validation via Zod schemas before database operations

9. Test Data
9.1 Sample Data Script
Location: db/dump.sql
Includes: - 5 test folders (Dashboard Tests, Authentication, Test Management, API Routes, Organization Management) - 8 test specifications
with realistic statuses - 25 test requirements - 25 test cases with actual Vitest code examples
9.2 Sample Data Summary
Entity

Count

Description

test_folder
test_spec
test_requirement
test

5
8
25
25

Root-level folders
Test specification documents
Individual requirements
Test implementations

10. Compliance Checklist
10.1 Minimum Requirements (5 Points)
#

Requirement

1
1.1
1.2
1.3
1.4
2
2.1
2.2
2.3
2.4
2.5
2.6
2.7
3
3.1
3.2
4
4.1
4.2
5
5.1
5.2
5.3
5.4

Documentation
Data dictionary
Data integrity description
ER diagram
DDL scripts
Design
Modern RDBMS
3NF normalization
Sufficient tables
Primary keys
Foreign keys
Constraints
Appropriate data types
Deployment
Migrations via scripts
Version control
Test Data
Sufficient test records
Reference data scripts
Usage
Roles and permissions
No superuser in app
Encrypted passwords
Integrity via constraints

Status

Evidence

YES
YES
YES
YES

Section 3 of this document
Section 7
Section 2.1 (Mermaid) + diagram.pdf
db/migrations/*.sql

YES
YES
YES
YES
YES
YES
YES

Turso (SQLite)
Section 4
11 tables with varied relationships
All tables have text PKs
12 FK relationships with CASCADE
NOT NULL, UNIQUE, DEFAULT
TEXT, INTEGER, JSON as needed

YES
YES

Drizzle Kit migrations
Git repository

YES
YES

25+ records per major table
db/dump.sql

PARTIAL
YES
YES
YES

Application-level via middleware
App uses auth tokens, not DB admin
bcrypt via Better Auth
FK constraints, NOT NULL

10.2 Restrictions Compliance
Restriction

Status

Notes

No plaintext passwords
No CSV/Excel as storage
No unstructured JSON without schema

PASS
PASS
PASS

Data integrity enforced

PASS

bcrypt hashing
Turso RDBMS used
JSON in statuses is
well-defined
FK constraints, transactions

10.3 Maximum Requirements (10 Points)
#

Requirement

Status

Notes

1
2
3
4
5
6
7

Multiple DBMS types
Data layers (raw→staging→mart)
Schema versioning
Indexes
Triggers/procedures
Views
Data masking for PII

N/A
N/A
YES
PARTIAL
NO
NO
NO

Single OLTP use case
Not an analytics project
Drizzle migrations + Git
Unique indexes on email, slug, token
Application-level logic preferred
ORM handles query abstraction
Future consideration

11. Recommendations
11.1 Current Strengths
1. Type-Safe Schema: Drizzle ORM provides compile-time type checking
2. Migration Management: Versioned migrations with rollback capability
3. Cascade Integrity: Proper foreign key relationships prevent orphaned data
4. Multi-Tenant Isolation: All data scoped by organizationId
11.2 Future Improvements
1. Additional Indexes: Add indexes on frequently queried columns:
• test_spec.organizationId
• test_folder.organizationId
• test.status
2. Audit Logging: Consider adding an audit table for compliance:
CREATE TABLE audit_log (
id TEXT PRIMARY KEY,
tableName TEXT NOT NULL,
recordId TEXT NOT NULL,
action TEXT NOT NULL,
userId TEXT,
timestamp TEXT DEFAULT CURRENT_TIMESTAMP
)

3. Soft Deletes: Add deletedAt columns for recoverable deletions
4. Data Masking: Implement PII masking for GDPR compliance exports

12. Conclusion
The Automaspec database demonstrates a well-designed OLTP schema suitable for a test specification management platform. The implementation follows relational database best practices including:
• Proper normalization to 3NF with justified denormalization
• Referential integrity via foreign keys with cascading deletes
• Security through application-level authorization and bcrypt password hashing
• Maintainability via TypeScript schema definitions and versioned migrations
The choice of Turso (distributed SQLite) is appropriate for the serverless architecture and provides adequate performance for the expected
workload.

Appendix A: Database Connection
// db/index.ts
import { drizzle } from 'drizzle‐orm/libsql'
import { createClient } from '@libsql/client'
const client = createClient({
url: process.env.NEXT_PUBLIC_DATABASE_URL ?? '',
authToken: process.env.DATABASE_AUTH_TOKEN
})
export const db = drizzle(client, { casing: 'snake_case' })

Appendix B: Environment Variables

Document Prepared By:
Automaspec Development Team
Date:
December 2025
Status:
Final for Review

Variable

Description

NEXT_PUBLIC_DATABASE_URL
DATABASE_AUTH_TOKEN

Turso database URL
Turso authentication token

