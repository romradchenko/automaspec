# Criterion: AI + Real-time Analytics + Tests

## Architecture Decision Record

### Status

**Status:** Accepted

**Date:** 2026-01-05

### Context

The platform requires an AI assistant for intelligent test management, an analytics dashboard for tracking test health metrics, and comprehensive testing for quality assurance. The AI must be safe and constrained to test management tasks only.

### Decision

**AI Assistant:**
- **SDK**: AI SDK v6.0.5
- **Providers**: OpenRouter (default), Google Gemini
- **Architecture**: Tool-assisted actions for safe mutations

**Analytics:**
- **Visualization**: Recharts v2.15.4
- **Backend**: oRPC endpoint with aggregations
- **Metrics**: Tests, specs, requirements, status distribution

**Testing:**
- **Framework**: Vitest v4.0.16 + React Testing Library
- **E2E**: Playwright
- **Git Hooks**: Lefthook for pre-commit testing

### Alternatives Considered

| Alternative | Pros | Cons | Why Not Chosen |
|-------------|------|------|----------------|
| LangChain | Feature-rich | Complex, heavier | AI SDK is simpler |
| D3.js | Powerful | Steep learning curve | Recharts is easier |
| Jest | Mature | Slower, more config | Vitest is faster |

### Consequences

**Positive:**
- AI safely executes test management tasks
- Clear visibility into test health metrics
- High test coverage with fast execution

**Negative:**
- Analytics uses polling, not WebSockets (scored 5)
- AI depends on external providers

## Implementation Details

### AI Architecture

```
app/ai/page.tsx          <- Chat UI with session history
    |
orpc/routes/ai.ts        <- POST /rpc/ai/chat
    |
AI SDK + Tools           <- Create folders, specs, requirements
    |
OpenRouter / Gemini      <- LLM providers
```

### AI Safety Controls

| Control | Implementation |
|---------|----------------|
| Input length limit | 2,000 characters max |
| Prompt injection guard | Blocked patterns list |
| Rate limiting | 30 requests / 60 seconds per org |
| Scoped actions | Only test management operations |

### AI Tool Actions

| Tool | Purpose |
|------|---------|
| Create folder | Create test folders |
| Find folder | Search by name |
| Create spec | Create spec with requirements |
| Replace requirements | Update spec requirements |

### Analytics Dashboard

| Metric | Visualization |
|--------|---------------|
| Total tests, specs, requirements | Metric cards |
| Tests growth | Line chart (per day) |
| Status distribution | Bar chart |
| Stale tests | Table |

### Testing Strategy

| Type | Tool | Coverage |
|------|------|----------|
| Unit/Component | Vitest + RTL | Components, utils |
| Integration | Vitest | oRPC routes, DB |
| E2E | Playwright | User flows |

### Test Metrics

| Metric | Target |
|--------|--------|
| Pass rate | >80% |
| Execution time | <30s for unit tests |
| Coverage | High for lib/utils and API |

## Requirements Checklist

| # | Requirement | Status | Evidence/Notes |
|---|-------------|--------|----------------|
| 1 | AI chat interface | ✅ | `/ai` page with history |
| 2 | AI tool actions | ✅ | 4 server-side tools |
| 3 | AI safety controls | ✅ | Guards + rate limiting |
| 4 | Analytics dashboard | ✅ | `/analytics` with charts |
| 5 | Period selection | ✅ | 7d, 30d, 90d tabs |
| 6 | Unit tests | ✅ | Vitest suite |
| 7 | E2E tests | ✅ | Playwright specs |
| 8 | Test coverage | ✅ | @vitest/coverage-v8 |

## Known Limitations

| Limitation | Impact | Potential Solution |
|------------|--------|-------------------|
| Polling-based analytics | Not true real-time | Add WebSocket updates |
| In-memory rate limiter | Resets on restart | Use Redis |

## References

- [AI Report](../../../docs_requirments/ai-assistant-requirements-report.md)
- [Analytics Report](../../../docs_requirments/analytics-report.md)
- [Tests Report](../../../docs_requirments/tests-report.md)
