# Test Suite for Automaspec

This directory contains unit and integration tests for the Automaspec test management system.

## Test Structure

```
__tests__/
├── setup.ts                          # Test setup and global mocks
├── components/                       # Component tests
│   ├── tree.test.tsx                # Dashboard tree component tests
│   └── test-details-panel.test.tsx  # Test details panel component tests
├── lib/                             # Library/utility tests
│   ├── constants.test.ts            # Constants validation tests
│   ├── types.test.ts                # Type schema validation tests
│   └── utils.test.ts                # Utility function tests
├── db/                              # Database schema tests
│   └── schema.test.ts               # Schema structure validation
└── integration/                     # Integration tests
    └── test-workflow.test.ts        # End-to-end workflow tests (skipped)
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
pnpm test __tests__/components/tree.test.tsx
```

## Test Coverage

### Component Tests

- **Tree Component** (`tree.test.tsx`)
    - Display test folders in tree structure
    - Handle empty folders array
    - Display specs within folders

- **Test Details Panel** (`test-details-panel.test.tsx`)
    - Display test spec details (name, description)
    - Display test statistics and requirements
    - Handle empty state (no spec selected)

### Library Tests

- **Constants** (`constants.test.ts`)
    - Test status constants
    - Spec status constants
    - Status configuration objects

- **Types** (`types.test.ts`)
    - Test spec schema validation
    - Test folder schema validation

- **Utils** (`utils.test.ts`)
    - Class name merger (`cn`) utility

### Database Tests

- **Schema** (`schema.test.ts`)
    - Table definitions
    - Column structure
    - Table names

### Integration Tests

- **Test Workflow** (`test-workflow.test.ts`)
    - Currently skipped (requires DATABASE_URL setup)
    - Tests full CRUD workflow for tests

## Test Framework

- **Vitest** - Test runner
- **React Testing Library** - Component testing
- **@testing-library/jest-dom** - DOM matchers

## Sample Data

Sample data has been updated to match the real project structure:

- Test folders: Dashboard Tests, Authentication, Test Management, API Routes, Organization Management
- Test specs: Realistic test files related to the project
- Test requirements: Actual features being tested
- Tests: Real unit test code examples

## Notes

- Integration tests are skipped by default as they require database connection
- To run integration tests, set `NEXT_PUBLIC_DATABASE_URL` environment variable
- All component tests use mocked data and don't require actual database
