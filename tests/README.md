# Test Suite for Automaspec

All tests live in the `tests/` directory.

## Test Structure

```
tests/
├─ setup.ts
├─ components/
│  ├─ analytics-page.test.tsx
│  ├─ folder-details-panel.test.tsx
│  └─ test-details-panel.test.tsx
├─ db/
│  └─ schema.test.ts
├─ integration/
│  └─ query-invalidation.test.ts
├─ lib/
│  ├─ constants.test.ts
│  ├─ types.test.ts
│  └─ utils.test.ts
└─ orpc/
   └─ routes/
      ├─ analytics.test.ts
      └─ tests.syncReport.test.ts
```

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage

# Run specific test file
pnpm test tests/components/folder-details-panel.test.tsx
```

## Coverage Areas

- Components: dashboard and analytics UI helpers
- Library: constants, schemas, utility helpers
- Database: schema definitions
- Integration: query invalidation helpers
- ORPC routes: analytics metrics and report syncing

## Test Framework

- Vitest
- React Testing Library
- @testing-library/jest-dom
