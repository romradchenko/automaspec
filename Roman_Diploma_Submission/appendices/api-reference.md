# API Reference

## Overview

| Attribute | Value |
|-----------|-------|
| **Base URL** | `https://automaspec.vercel.app/rpc` |
| **Authentication** | Session-based (cookies) |
| **Format** | JSON |
| **Documentation** | [Interactive Docs](https://automaspec.vercel.app/rpc/docs) |

The Automaspec API is built using **oRPC** which provides type-safe RPC endpoints. Full interactive documentation is available at `/rpc/docs` powered by Scalar UI.

## Authentication

All API endpoints require authentication via session cookies. Users must be logged in through the web interface or use API keys for programmatic access.

### Session-Based Auth

```http
Cookie: session=<session_token>
```

### API Key Auth (for integrations)

```http
Authorization: Bearer <api_key>
```

## Core Endpoints

### Folders

#### List Folders

```http
GET /rpc/folders.list
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| organizationId | string | Yes | Organization UUID |

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Feature Tests",
      "parentFolderId": null,
      "order": 0
    }
  ]
}
```

#### Create Folder

```http
POST /rpc/folders.create
```

**Request Body:**

```json
{
  "name": "New Folder",
  "organizationId": "uuid",
  "parentFolderId": null
}
```

---

### Test Specs

#### List Specs

```http
GET /rpc/specs.list
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| folderId | string | Yes | Parent folder UUID |

#### Create Spec

```http
POST /rpc/specs.create
```

**Request Body:**

```json
{
  "name": "Login Tests",
  "folderId": "uuid",
  "organizationId": "uuid"
}
```

#### Get Spec

```http
GET /rpc/specs.get
```

**Query Parameters:**

| Parameter | Type | Required |
|-----------|------|----------|
| id | string | Yes |

---

### Requirements

#### List Requirements

```http
GET /rpc/requirements.list
```

**Query Parameters:**

| Parameter | Type | Required |
|-----------|------|----------|
| specId | string | Yes |

#### Create Requirement

```http
POST /rpc/requirements.create
```

**Request Body:**

```json
{
  "name": "User can login with valid credentials",
  "description": "Verify that...",
  "specId": "uuid"
}
```

---

### Tests

#### List Tests

```http
GET /rpc/tests.list
```

**Query Parameters:**

| Parameter | Type | Required |
|-----------|------|----------|
| requirementId | string | Yes |

#### Create Test

```http
POST /rpc/tests.create
```

**Request Body:**

```json
{
  "requirementId": "uuid",
  "status": "pending",
  "framework": "vitest",
  "code": "describe('Login', () => { ... })"
}
```

#### Update Test Status

```http
POST /rpc/tests.updateStatus
```

**Request Body:**

```json
{
  "id": "uuid",
  "status": "passed"
}
```

---

### AI Generation

#### Generate Test Code

```http
POST /rpc/ai.generate
```

**Request Body:**

```json
{
  "requirementId": "uuid",
  "context": "Additional context..."
}
```

**Response (Streaming):**

```json
{
  "code": "describe('Feature', () => {\n  it('should...', () => {\n    // Generated test\n  })\n})"
}
```

---

### Analytics

#### Get Metrics

```http
GET /rpc/analytics.getMetrics
```

**Query Parameters:**

| Parameter | Type | Required |
|-----------|------|----------|
| organizationId | string | Yes |
| period | string | No (default: "7d") |

---

## Error Responses

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Not logged in |
| 403 | Forbidden - No permission |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limited |
| 500 | Internal Server Error |

**Error Response Format:**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": { ... }
  }
}
```

## Rate Limiting

| Tier | Requests/Minute | Requests/Day |
|------|-----------------|--------------|
| Free | 60 | 1,000 |
| Pro | 300 | 10,000 |

## OpenAPI Specification

Full OpenAPI 3.0 specification available at:

- **Interactive Docs**: [https://automaspec.vercel.app/rpc/docs](https://automaspec.vercel.app/rpc/docs)
- **JSON Spec**: [https://automaspec.vercel.app/rpc/spec](https://automaspec.vercel.app/rpc/spec)
