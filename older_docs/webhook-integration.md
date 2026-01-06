# Webhook Integration Guide (Vitest → Automaspec)

Automaspec provides a webhook endpoint to sync Vitest JSON results from CI/CD into the Automaspec database.

## 1. Webhook Endpoint

```
POST /api/webhook/sync-tests
Content-Type: application/json
x-api-key: ams_xxx...
```

### Authentication

- The webhook requires an API key in the `x-api-key` header.
- Create API keys in the Profile page (API Keys section).

## 2. Request Body (Vitest JSON Report)

The endpoint expects a Vitest JSON reporter output shape containing `testResults[].assertionResults[]`.

Important matching rule:

- Automaspec matches incoming assertions by comparing `assertion.title` to the **requirement name** stored in Automaspec (case-insensitive).
- For best results, name your `it('...')` titles exactly the same as the requirement names you maintain in the UI.

Example:

```json
{
  "testResults": [
    {
      "assertionResults": [
        { "title": "User can sign in", "status": "passed" },
        { "title": "Invalid password shows error", "status": "failed" }
      ]
    }
  ]
}
```

## 3. Response

Success (200):

```json
{ "updated": 5, "missing": 2 }
```

- `updated`: number of tests whose status changed
- `missing`: number of tests in Automaspec that were not found in the report and were marked as `missing`

Errors:

- `401` when the API key is missing or invalid
- `400` when the API key is valid but the user has no organization
- `500` on unexpected server errors

## 4. GitHub Actions Setup

### Required Secrets

| Secret | Example |
|-------|---------|
| `AUTOMASPEC_WEBHOOK_URL` | `https://your-automaspec-instance.com/api/webhook/sync-tests` |
| `AUTOMASPEC_API_KEY` | `ams_...` |

### Workflow Snippet

This is compatible with the repository’s workflows under `.github/workflows/*`.

```yaml
- name: Run tests with JSON reporter
  run: pnpm test run -- --reporter=json --outputFile=test-results.json
  continue-on-error: true

- name: Sync test results to Automaspec
  if: always()
  run: |
    curl -X POST \
      -H "Content-Type: application/json" \
      -H "x-api-key: ${{ secrets.AUTOMASPEC_API_KEY }}" \
      -d @test-results.json \
      "${{ secrets.AUTOMASPEC_WEBHOOK_URL }}"
```

## 5. Local Testing

```bash
pnpm test run -- --reporter=json --outputFile=test-results.json

curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: ams_your_api_key_here" \
  -d @test-results.json \
  http://localhost:3000/api/webhook/sync-tests
```

## 6. Status Mapping

Vitest status values are mapped directly:

- `passed`, `failed`, `skipped`, `todo`, `pending`, `disabled`

If a test exists in Automaspec but is not present in the report payload, it is marked as `missing`.

