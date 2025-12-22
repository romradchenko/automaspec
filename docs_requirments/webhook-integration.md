# Webhook Integration Guide

Automaspec provides a webhook endpoint to automatically sync your test results from CI/CD pipelines like GitHub Actions.

## Quick Start

1. **Create an API key** in your Profile → API Keys section
2. **Add the key to your CI/CD secrets** as `AUTOMASPEC_API_KEY`
3. **Add the webhook URL** as `AUTOMASPEC_WEBHOOK_URL`
4. **Configure your workflow** to call the webhook after tests

## Webhook Endpoint

```
POST /api/webhook/sync-tests
Content-Type: application/json
x-api-key: ams_xxx...
```

### Authentication

All requests must include an API key in the `x-api-key` header. Create API keys in your Profile page.

### Request Body

The webhook expects a Vitest-compatible JSON test report:

```json
{
  "testResults": [
    {
      "assertionResults": [
        {
          "title": "should validate user input",
          "status": "passed"
        },
        {
          "title": "should handle errors gracefully",
          "status": "failed"
        }
      ]
    }
  ]
}
```

### Response

**Success (200):**
```json
{
  "updated": 5,
  "missing": 2
}
```

**Unauthorized (401):**
```json
{
  "error": "Missing API key"
}
```

- `updated`: Number of tests whose status was updated
- `missing`: Number of tests in the database that weren't in the report (marked as missing)

## GitHub Actions Setup

### 1. Configure Vitest Reporter

Add JSON reporter to your `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    reporters: ['default', 'json'],
    outputFile: {
      json: 'test-results.json'
    }
  }
})
```

Or use the CLI flag when running tests:

```bash
vitest run --reporter=json --outputFile=test-results.json
```

### 2. Add GitHub Secrets

Add these secrets to your repository (Settings → Secrets and variables → Actions):

| Secret Name | Value |
|-------------|-------|
| `AUTOMASPEC_WEBHOOK_URL` | `https://your-automaspec-instance.com/api/webhook/sync-tests` |
| `AUTOMASPEC_API_KEY` | Your API key from Profile → API Keys |

### 3. Create Workflow File

Create `.github/workflows/automaspec-sync.yml`:

```yaml
name: Sync Test Results to Automaspec

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  test-and-sync:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v6.0.1

      - name: Setup Node.js
        uses: actions/setup-node@v6.1.0
        with:
          node-version: '24'
          cache: 'npm'

      - name: Install dependencies
        run: pnpm install

      - name: Run tests with JSON reporter
        run: pnpm test -- --reporter=json --outputFile=test-results.json
        continue-on-error: true

      - name: Sync test results to Automaspec
        if: always()
        run: |
          curl -X POST \
            -H "Content-Type: application/json" \
            -H "x-api-key: ${{ secrets.AUTOMASPEC_API_KEY }}" \
            -d @test-results.json \
            ${{ secrets.AUTOMASPEC_WEBHOOK_URL }}
```

## Local Testing

Test the webhook locally using curl:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: ams_your_api_key_here" \
  -d @test-results.json \
  http://localhost:3000/api/webhook/sync-tests
```

## Test Status Mapping

The webhook maps test statuses from your test runner:

| Test Runner Status | Automaspec Status |
|-------------------|-------------------|
| passed            | passed            |
| failed            | failed            |
| skipped           | skipped           |
| todo              | todo              |
| pending           | pending           |
| disabled          | disabled          |

Tests that exist in Automaspec but are not included in the report will be marked as `missing`.

## Security Notes

- API keys are hashed before storage
- Each API key is tied to a specific user and their organization
- Delete unused API keys promptly
- Rotate API keys if they may have been compromised
