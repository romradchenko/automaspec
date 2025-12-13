# Webhook Integration Guide

Automaspec provides a webhook endpoint to automatically sync your test results from CI/CD pipelines like GitHub Actions.

## Webhook Endpoint

```
POST /api/webhook/sync-tests
Content-Type: application/json
```

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

```json
{
  "updated": 5,
  "missing": 2
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

### 2. Add GitHub Secret

Add `AUTOMASPEC_WEBHOOK_URL` to your repository secrets:

1. Go to your repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `AUTOMASPEC_WEBHOOK_URL`
4. Value: `https://your-automaspec-instance.com/api/webhook/sync-tests`

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
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests with JSON reporter
        run: npm test -- --reporter=json --outputFile=test-results.json
        continue-on-error: true

      - name: Sync test results to Automaspec
        if: always()
        run: |
          curl -X POST \
            -H "Content-Type: application/json" \
            -d @test-results.json \
            ${{ secrets.AUTOMASPEC_WEBHOOK_URL }}
```

## Local Testing

Test the webhook locally using curl:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
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
