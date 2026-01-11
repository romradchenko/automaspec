# Database Schema Diagram

## Entity Relationship Diagram

```mermaid
erDiagram
    %% ==========================================
    %% USER & AUTHENTICATION TABLES
    %% ==========================================
    
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

    verification {
        text id PK
        text identifier
        text value
        timestamp expiresAt
        timestamp createdAt
        timestamp updatedAt
    }

    apiKey {
        text id PK
        text name
        text start
        text prefix
        text key
        text userId FK
        integer refillInterval
        integer refillAmount
        timestamp lastRefillAt
        boolean enabled
        boolean rateLimitEnabled
        integer rateLimitTimeWindow
        integer rateLimitMax
        integer requestCount
        integer remaining
        timestamp lastRequest
        timestamp expiresAt
        timestamp createdAt
        timestamp updatedAt
        text permissions
        text metadata
    }

    rateLimit {
        text id PK
        text key
        integer count
        timestamp lastRequest
    }

    %% ==========================================
    %% ORGANIZATION TABLES
    %% ==========================================

    organization {
        text id PK
        text name
        text slug UK
        text logo
        text plan
        timestamp createdAt
        timestamp updatedAt
        text metadata
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

    %% ==========================================
    %% TEST MANAGEMENT TABLES
    %% ==========================================

    testFolder {
        text id PK
        text name
        text description
        text parentFolderId FK
        text organizationId FK
        integer order
        text createdAt
        text updatedAt
    }

    testSpec {
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

    testRequirement {
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

    %% ==========================================
    %% RELATIONSHIPS
    %% ==========================================

    %% User Authentication Relationships
    user ||--o{ account : "has"
    user ||--o{ session : "has"
    user ||--o{ apiKey : "owns"

    %% Organization Membership Relationships
    user ||--o{ member : "is"
    organization ||--o{ member : "has"
    
    %% Invitation Relationships
    organization ||--o{ invitation : "has"
    user ||--o{ invitation : "invites"

    %% Test Folder Hierarchy (self-referencing)
    testFolder ||--o{ testFolder : "contains"
    
    %% Organization to Test Structure
    organization ||--o{ testFolder : "owns"
    organization ||--o{ testSpec : "owns"

    %% Test Hierarchy
    testFolder ||--o{ testSpec : "contains"
    testSpec ||--o{ testRequirement : "has"
    testRequirement ||--o{ test : "has"
```

## Tables Overview

### Authentication & Users

| Table | Description |
|-------|-------------|
| `user` | Core user information including email, name, and verification status |
| `account` | OAuth provider accounts linked to users (supports multiple providers) |
| `session` | Active user sessions with tokens and metadata |
| `verification` | Email/phone verification tokens |
| `apiKey` | API keys for programmatic access with rate limiting |
| `rateLimit` | Rate limiting tracking for API requests |

### Organizations

| Table | Description |
|-------|-------------|
| `organization` | Organizations/workspaces with plans (free/paid) |
| `member` | User membership in organizations with roles (owner/admin/member) |
| `invitation` | Pending invitations to join organizations |

### Test Management

| Table | Description |
|-------|-------------|
| `testFolder` | Hierarchical folder structure for organizing specs (supports nesting) |
| `testSpec` | Test specifications containing requirements |
| `testRequirement` | Individual requirements within a spec |
| `test` | Actual test implementations linked to requirements |

## Key Relationships

### User → Account (1:N)
A user can have multiple linked accounts (Google, GitHub, etc.)

### User ↔ Organization (N:M via Member)
Users can belong to multiple organizations with different roles

### Organization → Test Structure
Each organization owns its own:
- Test folders (hierarchical)
- Test specs (can be in folders or root level)

### Test Hierarchy
```
Organization
└── TestFolder (recursive, can nest)
    └── TestSpec
        └── TestRequirement
            └── Test
```

## Notes

- All IDs use `text` type (UUIDs)
- Timestamps use SQLite integer mode for `auth` tables and text with `CURRENT_TIMESTAMP` for `test` tables
- Cascading deletes are configured for referential integrity
- The `testFolder.parentFolderId` creates a self-referential hierarchy for nested folders
