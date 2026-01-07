# Qualitative & Quantitative Testing

## Architecture Decision Record

### Status

**Status:** Accepted

**Date:** 2025-10-15

### Context

The application requires comprehensive testing to ensure quality, reliability, and maintainability. Testing covers both the application under development and demonstrates testing capabilities as a core feature of Automaspec.

### Decision

Using Vitest for unit/component testing, React Testing Library for component tests, and Playwright for E2E testing. Tests are integrated into CI/CD pipeline via GitHub Actions.

## Requirements Checklist

| # | Requirement | Status | Evidence/Notes |
|---|-------------|--------|----------------|
| 1 | Structured testing workflow | ✅ | Unit, component, integration, E2E tests |
| 2 | Test scope & goals defined | ✅ | Coverage targets, quality gates |
| 3 | Requirements analysis for testable functionality | ✅ | Feature-based test organization |
| 4 | Manual test cases / checklists | ✅ | Test scenarios documented |
| 5 | Testing metrics (pass rate, coverage) | ✅ | Vitest coverage reports |
| 6 | Usability / UX findings documented | ✅ | Responsive design validation |
| 7 | Structured test execution report | ✅ | CI/CD test reports |
| 8 | Professional testing tools | ✅ | Vitest, Playwright, RTL |
| 9 | Git repository with commit history | ✅ | GitHub repository |
| 10 | Technical report | ✅ | This document |

## Testing Strategy

### Test Levels

| Level | Tool | Purpose | Location |
|-------|------|---------|----------|
| Unit | Vitest | Function/module testing | `__tests__/lib/` |
| Component | Vitest + RTL | React component testing | `__tests__/components/` |
| Integration | Vitest | API/database integration | `__tests__/integration/` |
| E2E | Playwright | Full user flows | `e2e/` |
| oRPC | Vitest | API procedure testing | `__tests__/orpc/` |

### Test Organization

```
__tests__/
├── ai.test.ts                    # AI integration tests
├── components/                   # Component tests
│   ├── requirement-item.test.tsx
│   ├── test-details-panel.test.tsx
│   └── test-item.test.tsx
├── db/
│   └── schema.test.ts           # Database schema tests
├── integration/                  # Integration tests
│   └── folder-hierarchy.test.ts
├── lib/                         # Utility tests
│   ├── auth.test.ts
│   ├── constants.test.ts
│   ├── db.test.ts
│   ├── get-database-url.test.ts
│   └── utils.test.ts
├── orpc/                        # oRPC procedure tests
│   ├── folders.test.ts
│   ├── requirements.test.ts
│   ├── router.test.ts
│   ├── specs.test.ts
│   └── tests.test.ts
└── setup.ts                     # Test setup configuration

e2e/
├── auth.spec.ts                 # Authentication E2E
├── dashboard.spec.ts            # Dashboard E2E
├── requirements.spec.ts         # Requirements E2E
├── helpers.ts                   # Test utilities
└── seed-db.ts                   # Test data seeding
```

## Test Coverage

### Coverage Targets

| Metric | Target | Current |
|--------|--------|---------|
| Line Coverage | ≥70% | ✅ |
| Branch Coverage | ≥60% | ✅ |
| Function Coverage | ≥70% | ✅ |
| Statement Coverage | ≥70% | ✅ |

### Running Tests

```bash
pnpm test              # Run all tests
pnpm test --watch      # Watch mode
pnpm test --coverage   # With coverage report
pnpm test __tests__/path/to/file.test.ts  # Single file
```

## Test Design Techniques

| Technique | Application |
|-----------|-------------|
| Equivalence Partitioning | Input validation tests |
| Boundary Value Analysis | Pagination, limits |
| State Transition | Auth flows, status changes |
| Decision Tables | Role-based access control |

## Quality Metrics

### Defect Tracking

- Issues tracked via GitHub Issues
- Prioritization: Critical, High, Medium, Low
- Linked to test cases via references

### Test Execution Metrics

| Metric | Description |
|--------|-------------|
| Pass Rate | Percentage of tests passing |
| Execution Time | Total test suite duration |
| Flaky Test Rate | Tests with inconsistent results |
| Coverage Delta | Coverage change per commit |

## CI/CD Integration

Tests run automatically on:
- Pull request creation
- Merge to main branch
- Manual workflow dispatch

### GitHub Actions Workflow

```yaml
- Run unit/component tests
- Generate coverage report
- Run E2E tests (on main)
- Report results to PR
```

## Usability Testing

### Responsive Design Validation

| Device Type | Viewport | Status |
|-------------|----------|--------|
| Mobile | 375px-767px | ✅ Tested |
| Tablet | 768px-1023px | ✅ Tested |
| Desktop | 1024px+ | ✅ Tested |

### Accessibility Testing

- WCAG 2.1 Level AA compliance goal
- Keyboard navigation support
- Screen reader compatibility
- Color contrast validation

## Known Limitations

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| E2E tests need DB access | Slower CI | Skip on PRs, run on main |
| AI tests mock LLM | May miss API issues | Manual verification |

## References

- [Requirements Document](../../../older_docs/Требования%20Qualitative%20or%20Quantitative%20Testing%20(Рома).md)
- [Test Directory](../../../__tests__/)
- [E2E Tests](../../../e2e/)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
