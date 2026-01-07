# API Reference

## Overview

Base URL: `[https://api.example.com/v1]`

Authentication: `[Bearer Token / API Key / None]`

## Endpoints

### [Resource 1]

#### GET /[resource]

Get all [resources].

**Request:**
```http
GET /[resource]
Authorization: Bearer [token]
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "[field]": "[value]"
    }
  ],
  "pagination": {
    "page": 1,
    "total": 100
  }
}
```

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 401 | Unauthorized |
| 500 | Server Error |

---

#### GET /[resource]/{id}

Get a single [resource] by ID.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | Resource ID |

**Response:**
```json
{
  "id": 1,
  "[field]": "[value]"
}
```

---

#### POST /[resource]

Create a new [resource].

**Request Body:**
```json
{
  "[field]": "[value]",
  "[field]": "[value]"
}
```

**Response:**
```json
{
  "id": 1,
  "[field]": "[value]",
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

#### PUT /[resource]/{id}

Update a [resource].

---

#### DELETE /[resource]/{id}

Delete a [resource].

---

### [Resource 2]

[Repeat endpoint documentation pattern]

## Error Responses

| Error Code | Message | Description |
|------------|---------|-------------|
| 400 | Bad Request | [When this occurs] |
| 401 | Unauthorized | [When this occurs] |
| 403 | Forbidden | [When this occurs] |
| 404 | Not Found | [When this occurs] |
| 500 | Internal Server Error | [When this occurs] |

## Rate Limiting

| Tier | Requests/Minute | Requests/Day |
|------|-----------------|--------------|
| Free | [X] | [X] |
| Premium | [X] | [X] |

## Swagger/OpenAPI

Full API documentation available at: `[Swagger URL or link to OpenAPI spec]`
