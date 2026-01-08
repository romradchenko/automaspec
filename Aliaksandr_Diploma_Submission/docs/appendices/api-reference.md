# API Reference

This document provides a reference for the application's API endpoints, which are defined using ORPC contracts. The API is Type-Safe and validated using Zod schemas.

## Account

> Contracts for user account data management.

### Export Account Data
- **Method:** `GET`
- **Path:** `/account/{userId}`
- **Summary:** Export account data
- **Description:** Export the current user account data including profile and organization memberships.
- **Input:** `{ userId: string }`
- **Output:** `{ user: { id, name, email, ... }, memberships: [{ organizationId, role, ... }] }`

### Delete Account
- **Method:** `DELETE`
- **Path:** `/account/{userId}`
- **Summary:** Delete account
- **Description:** Permanently delete the current user account.
- **Input:** `{ userId: string }`
- **Output:** `{ success: boolean }`

---

## AI

> AI assistant integration endpoints.

### Chat with AI
- **Method:** `POST`
- **Path:** `/ai/chat`
- **Summary:** Chat with AI
- **Description:** Send chat messages to the AI assistant and receive a streamed or blocked response.
- **Input:** `AIChatRequestSchema` (Message history, model params)
- **Output:** `AIChatResponseSchema` (AI Generation)

---

## Analytics

> Organization metrics and statistics.

### Get Metrics
- **Method:** `GET`
- **Path:** `/analytics/metrics`
- **Summary:** Get analytics metrics
- **Description:** detailed analytics metrics for the active organization dashboard.
- **Input:** `AnalyticsMetricsInputSchema`
- **Output:** `AnalyticsMetricsOutputSchema` (Counts, graphs, trends)

---

## Tests

> Core domain logic for Test Management (Folders, Specs, Requirements, Tests).

### Test Folders

**Get Folder**
- `GET /test-folders/{id}`
- Get a single test folder by ID.

**List Folders**
- `GET /test-folders`
- List folders in the organization, optionally filtered by `parentFolderId`.

**Get Children**
- `GET /test-folders/{folderId}/children`
- Get direct children (sub-folders or specs) of a specific folder. Supports optional `depth` parameter.

**Find by Name**
- `GET /test-folders/find`
- Find a folder by its exact name.

**Create/Update Folder**
- `POST /test-folders/{id}`
- Upsert a test folder definition.

**Edit Folder**
- `PATCH /test-folders/{id}`
- Partially update folder fields (name, description, order).

**Delete Folder**
- `DELETE /test-folders/{id}`
- Delete a folder (and cascade delete contents).

### Test Specs

**Get Spec**
- `GET /test-specs/{id}`
- Get a single test spec file definition.

**List Specs**
- `GET /test-specs`
- List specs, optionally filtered by `folderId`.

**Create/Update Spec**
- `PUT /test-specs/{id}`
- Upsert a test spec reference.

**Edit Spec**
- `PATCH /test-specs/{id}`
- Partially update spec fields.

**Delete Spec**
- `DELETE /test-specs/{id}`
- Delete a spec reference.

### Test Requirements

**List Requirements**
- `GET /test-requirements`
- List requirements, filtered by `specId`.

**Create/Update Requirement**
- `PUT /test-requirements/{id}`
- Upsert a business requirement.

**Edit Requirement**
- `PATCH /test-requirements/{id}`
- Partially update requirement details.

**Replace Spec Requirements**
- `PUT /test-specs/{specId}/requirements`
- Bulk replace all requirements for a specific spec (Sync mode).

**Delete Requirement**
- `DELETE /test-requirements/{id}`
- Remove a specific requirement.

### Tests (Executions)

**List Tests**
- `GET /tests`
- List test executions, filtered by `requirementId`.

**Create/Update Test**
- `PUT /tests/{id}`
- Upsert a test execution record.

**Edit Test**
- `PATCH /tests/{id}`
- Update test status or code snippet.

**Delete Test**
- `DELETE /tests/{id}`
- Remove a test execution record.

**Sync Report**
- `POST /tests/sync-report`
- Upload a Vitest/Playwright JSON report to automatically update test statuses.

**Get Report**
- `GET /tests/report`
- Retrieve the latest stored test report.
