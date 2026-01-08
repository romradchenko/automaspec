# Database Schema

## Overview

The application uses **SQLite** (via LibSQL/Turso) as its relational database, with **Drizzle ORM** for type-safe schema definition and query building. The schema is modularized into two main domains: **Authentication/Organization** and **Testing Core**.

## Entity Relationship Diagram



## Tables Reference

### Authentication & Organization (`db/schema/auth.ts`)

#### `user`
Core user entity.
- `id` (text, PK): Unique identifier
- `name` (text): Display name
- `email` (text, unique): User email
- `emailVerified` (boolean): Verification status
- `image` (text): Avatar URL
- `createdAt`, `updatedAt` (timestamp)

#### `session`
Active user sessions.
- `id` (text, PK)
- `userId` (text, FK -> user.id): Owner
- `token` (text, unique): Session token
- `expiresAt` (timestamp): Expiration time
- `ipAddress`, `userAgent` (text): Audit info
- `activeOrganizationId` (text): Context for current session

#### `account`
OAuth accounts linked to users (Google, GitHub, etc.).
- `id` (text, PK)
- `userId` (text, FK -> user.id)
- `providerId` (text): e.g., "google"
- `accountId` (text): Provider-specific ID
- `accessToken`, `refreshToken` (text): OAuth tokens

#### `organization`
Tenancy unit.
- `id` (text, PK)
- `name` (text)
- `slug` (text, unique): URL-friendly identifier
- `plan` (text): Subscription plan (default: 'free')
- `metadata` (text): JSON metadata

#### `member`
Linking table between Users and Organizations.
- `id` (text, PK)
- `organizationId` (text, FK -> organization.id)
- `userId` (text, FK -> user.id)
- `role` (text): 'owner', 'member', etc.

#### `invitation`
Pending organization invites.
- `id` (text, PK)
- `email` (text): Invitee email
- `organizationId` (text, FK -> organization.id)
- `inviterId` (text, FK -> user.id)
- `status` (text): 'pending', 'accepted'
- `role` (text): Role to be assigned

#### `apiKey`
API Access keys for external integrations.
- `id` (text, PK)
- `userId` (text, FK -> user.id)
- `key` (text): Hashed key
- `permissions` (text): Scopes
- `rateLimitEnabled` (boolean)

---

### Testing Core (`db/schema/tests.ts`)

#### `test_folder`
Hierarchical organization for test specs.
- `id` (text, PK)
- `name` (text)
- `organizationId` (text, FK -> organization.id)
- `parentFolderId` (text, nullable): For subfolders
- `order` (integer): Sorting order

#### `test_spec`
A file or module containing requirements.
- `id` (text, PK)
- `name` (text)
- `fileName` (text): Source file link
- `folderId` (text, FK -> test_folder.id)
- `organizationId` (text, FK -> organization.id)
- `statuses` (json): Aggregated stats (passed, failed counts)
- `numberOfTests` (integer)

#### `test_requirement`
Specific business requirement to be tested.
- `id` (text, PK)
- `name` (text): Requirement title
- `description` (text)
- `specId` (text, FK -> test_spec.id)
- `order` (integer)

#### `test`
Individual test execution implementation.
- `id` (text, PK)
- `requirementId` (text, FK -> test_requirement.id)
- `status` (text): Test result status
- `framework` (text): 'playwright', 'jest', etc.
- `code` (text): Test code snippet
