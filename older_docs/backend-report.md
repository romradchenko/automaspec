Backend Report for Automaspec
Overview
This report provides a comprehensive analysis of the Automaspec backend architecture, technology stack, and compliance with diploma
project requirements.

1. Technology Stack
Component

Technology

Version

Framework
Language
ORM
Database
RPC Framework
Authentication
Validation
Testing
Logging
API Documentation

Next.js (App Router)
TypeScript
Drizzle ORM
Turso (SQLite)
oRPC
Better Auth
Zod
Vitest
Pino
Scalar (OpenAPI)

16.1.1
5.9.3
0.45.1
libsql 0.15.15
1.13.2
1.4.10
4.3.4
4.0.16
10.1.0
via oRPC plugins

2. Architecture Overview
2.1 Layered Architecture
app/(backend)/rpc/[...all]/route.ts
|
orpc/routes/*.ts
|
orpc/contracts/*.ts
|
db/schema/*.ts + Drizzle ORM
|
Turso (SQLite)

<‐ Presentation Layer (API Routes)
<‐ Business Logic Layer
<‐ Contract Layer (API Contracts)
<‐ Data Access Layer
<‐ Database Layer

2.2 Key Files
• API Entry Point: app/(backend)/rpc/[…all]/route.ts
• Router Definition: orpc/routes/index.ts
• Contracts: orpc/contracts/index.ts
• Database Schema: db/schema/index.ts
• Middleware: orpc/middleware.ts
• Context: lib/orpc/context.ts

3. API Endpoints
3.1 Test Management (/rpc/test‐folders/*, /rpc/test‐specs/*, etc.)
Method

Path

GET
GET
GET

/test‐folders/{id}
Get folder by ID
/test‐folders
List folders
/test‐
Get folder children (recursive)
folders/{folderId}/children
/test‐folders/find
Find folder by exact name
/test‐folders/{id}
Create/update folder

GET
POST

Description

Method

Path

PATCH
DELETE
GET
GET
PUT
PATCH
DELETE
GET
PUT
PATCH
PUT

/test‐folders/{id}
Edit folder fields
/test‐folders/{id}
Delete folder
/test‐specs/{id}
Get spec by ID
/test‐specs
List specs
/test‐specs/{id}
Create/update spec
/test‐specs/{id}
Edit spec fields
/test‐specs/{id}
Delete spec
/test‐requirements
List requirements
/test‐requirements/{id}
Create/update requirement
/test‐requirements/{id}
Edit requirement fields
/test‐
Replace requirements for a spec
specs/{specId}/requirements
/test‐requirements/{id}
Delete requirement
/tests
List tests
/tests/{id}
Create/update test
/tests/{id}
Edit test fields
/tests/{id}
Delete test
/tests/sync‐report
Sync Vitest report
/tests/report
Get test report

DELETE
GET
PUT
PATCH
DELETE
POST
GET

Description

3.2 Account Management (/rpc/account/*)
Method

Path

Description

GET
DELETE

/account/{userId}
/account/{userId}

Export account data (GDPR)
Delete account

3.3 Authentication (/api/auth/*)
Handled by Better Auth with organization plugin support.
3.4 AI Assistant (/rpc/ai/*)
Method

Path

Description

POST

/ai/chat

Chat with the AI assistant (tool-enabled)

Method

Path

Description

GET

/analytics/metrics

Organization analytics metrics

3.5 Analytics (/rpc/analytics/*)

4. Database Schema
4.1 Core Tables
- test_folder - Hierarchical folder structure - test_spec - Test specifications with status aggregation test_requirement - Requirements within specs - test - Individual test cases

Test Management:

Authentication (Better Auth): - user - User accounts - account - OAuth accounts - session - Active sessions - organization - Organizations/teams - member - Organization membership - invitation - Pending invitations - verification - Email verification

4.2 Key Features
• Timestamps: Automatic created_at/updated_at via SQL defaults
• Cascading Deletes: Foreign key constraints with ON DELETE CASCADE
• Organization Isolation: All test data scoped by organizationId
• Status Aggregation: testSpec.statuses stores JSON counts

5. Security Implementation
5.1 Authentication
• Email/password authentication via Better Auth
• Session-based authentication with secure cookies
• bcrypt password hashing (industry standard)
5.2 Authorization
• Auth Middleware: Validates session existence
• Organization Middleware: Ensures active organization context
• Role-based access: Owner, Admin, Member
5.3 Input Validation
• All inputs validated via Zod schemas
• Type-safe contracts via oRPC
• SQL injection protection via Drizzle ORM (parameterized queries)

6. Error Handling
6.1 Global Error Handler
interceptors: [
onError((error: any) => {
console.error('RPC Error:', error)
if (error.cause && error.cause.issues) {
console.error('Validation Issues:', ...)
}
})
]

6.2 Custom Errors
Using ORPCError for business logic errors with proper HTTP status codes.

7. Logging
7.1 Implementation
const logger = pino(pretty({ colorize: true, translateTime: 'HH:MM:ss.l' }))
new LoggingHandlerPlugin({
logger,
generateId: () => crypto.randomUUID(),
logRequestResponse: true,
logRequestAbort: true
})

8. API Documentation
• Auto-generated OpenAPI spec via OpenAPIReferencePlugin
• Interactive docs at /rpc/docs (Scalar UI)
• Spec available at /rpc/spec
Screenshots
API Documentation Overview:
API Endpoints List (Sidebar):
Endpoint Details with Schema:

9. Containerization
Dockerfile included with multi-stage build:
1. deps: Install dependencies
2. builder: Build Next.js application
3. runner: Production runtime (standalone output)

10. Testing
10.1 Test Structure
__tests__/
components/
db/
integration/
lib/
orpc/
e2e/

‐ UI component tests (React Testing Library)
‐ Schema validation tests
‐ Workflow‐style tests
‐ Utility and schema tests
‐ Middleware and route tests
‐ Playwright end‐to‐end tests

10.2 Coverage
• 16 test files under __tests__ (unit/component/workflow tests)
• Unit tests for business logic
• Workflow-style tests for core flows

11. Compliance with Diploma Requirements
Minimum Requirements Checklist
#

Requirement

Status

Implementation

1
2
3
4
5
6
7
8
9
10

Modern Framework
Database
ORM
Layered Architecture
SOLID Principles
API Documentation
Global Error Handling
Logging
Production Deployment
Test Coverage

YES
YES
YES
YES
PARTIAL
YES
YES
YES
PENDING
NEEDS WORK

Next.js 16 (Node.js)
Turso (SQLite)
Drizzle ORM
Routes/Contracts/DB layers
SRP, DIP followed; pure functions
OpenAPI/Scalar at /rpc/docs
oRPC interceptors
Pino with structured logs
Dockerfile ready, Vercel config
~49 tests, coverage % unknown

Security Checklist

Figure 1: API Docs Overview

Figure 2: API Endpoints

Figure 3: Endpoint Details

Check

Status

Notes

No unsafe hashing (MD5/SHA1)
No plaintext passwords
Input validation
SQL injection protection
No hardcoded secrets
JSON data format
Git version control

YES
YES
YES
YES
YES
YES
YES

bcrypt via Better Auth
Hashed in DB
Zod schemas
Drizzle ORM
Environment variables
All API responses
Full history

Negative Checks (No deductions)
Issue

Status

Magic strings
Code duplication
Monolithic code
HTTP codes
API stubs

PASS - Constants in lib/constants.ts
PASS - DRY principles followed
PASS - Modular structure
PASS - Proper status codes
PASS - Real DB interactions

12. Recommendations for Improvement
1. Test Coverage: Run vitest ‐‐coverage to measure and reach 70% minimum
2. CI/CD: Add GitHub Actions workflow for automated testing/deployment
3. Monitoring: Consider adding health check endpoint
4. Rate Limiting: Implement via middleware for production

13. Conclusion
The Automaspec backend demonstrates a well-structured, modern architecture using Next.js with oRPC for type-safe APIs. The implementation follows most SOLID principles through functional programming patterns (no classes), proper layering, and clean separation of
concerns.
Strengths: - Type-safe end-to-end with TypeScript and Zod - Modern ORM with migration support - Comprehensive API documentation Proper authentication/authorization - Structured logging
Areas for Diploma Defense: - Measure and document test coverage percentage - Deploy to production environment - Add CI/CD pipeline
for maximum points

