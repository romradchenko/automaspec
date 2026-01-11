# Vitest + npm for Automaspec

Minimal Vitest project template using npm with GitHub Actions workflow for syncing test results to Automaspec.

## Quick Start

1. Copy this folder to your project or use it as a template
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run tests locally:
   ```bash
   npm test
   ```

## Automaspec Integration

### Step 1: Create API Key

1. Go to your Automaspec instance
2. Navigate to **Profile → API Keys**
3. Click **Create API Key**
4. Copy the generated key

### Step 2: Configure GitHub Secrets

Add these secrets to your repository (**Settings → Secrets and variables → Actions**):

| Secret | Value |
|--------|-------|
| `AUTOMASPEC_API_KEY` | Your API key from Step 1 |
| `AUTOMASPEC_WEBHOOK_URL` | `https://your-automaspec-instance.com/api/webhook/sync-tests` |

### Step 3: Copy Workflow File

Copy `.github/workflows/sync-tests.yml` to your project's `.github/workflows/` folder.

## Naming Tests to Match Requirements

Test names in your `it()` blocks should match requirement names in Automaspec:

```typescript
// In Automaspec: Create a requirement named "should add two numbers correctly"
// In your test file:
it('should add two numbers correctly', () => {
    expect(2 + 2).toBe(4)
})
```

The matching is **case-insensitive**, so "Should Add Two Numbers Correctly" will match "should add two numbers correctly".

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:json` | Run tests and output JSON report |
