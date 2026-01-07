# Criterion: API Documentation

## Architecture Decision Record

### Status

**Status:** Accepted

**Date:** 2026-01-07

### Context

As a developer-centric tool, Automaspec requires clear, accurate, and interactive API documentation. The API needs to support complex operations like test synchronization, AI-assisted management, and multi-tenant organization flows. Key requirements include type safety, automatic synchronization between code and documentation, and a low-friction "Getting Started" experience for external integrations.

### Decision

We implemented a type-safe RPC system using **oRPC** (v1.13.2), which serves as the source of truth for both the implementation and the documentation. By using **Zod** for schema validation, we automatically generate a standards-compliant **OpenAPI 3.0** specification.

Key technical choices:
- **oRPC**: For building type-safe APIs with automatic OpenAPI generation.
- **Scalar UI**: An interactive documentation explorer served at `/rpc/docs`.
- **Zod**: For schema definitions and input/output validation.
- **oRPC OpenAPI Plugin**: To bridge the RPC layer with standard REST/OpenAPI formats.

### Alternatives Considered

| Alternative | Pros | Cons | Why Not Chosen |
|-------------|------|------|----------------|
| **Manual Swagger/YAML** | Full control over description | High risk of documentation drift; high maintenance. | Hard to keep in sync with rapidly evolving RPC routes. |
| **tRPC with OpenAPI** | Familiar ecosystem | Additional complexity to expose standard REST; less native OpenAPI support than oRPC. | oRPC provides a more streamlined path to OpenAPI spec generation. |
| **Docusaurus / GitBook** | Great for long-form guides | Separate from code; manual updates required for reference. | Used for conceptual guides, but reference documentation must be automated. |

### Consequences

**Positive:**
- **Zero Drift**: Documentation is automatically updated when code changes.
- **Interactive**: Developers can test endpoints directly in the browser via Scalar.
- **Type Safety**: End-to-end type safety from server to generated client/docs.
- **Standardized**: Exports a valid OpenAPI JSON spec for use with Postman, Insomnia, etc.

**Negative:**
- Requires specific oRPC/Zod knowledge to extend.
- Generated docs can sometimes be too verbose without manual fine-tuning.

**Neutral:**
- Shift from traditional REST controllers to RPC-style route handlers.

## Implementation Details

### Project Structure

```
orpc/
├── contracts/           # API Definitions (source of truth)
│   ├── tests.ts         # Test management contracts
│   ├── ai.ts            # AI assistant contracts
│   └── analytics.ts     # Organization metrics contracts
├── routes/              # Business logic implementation
│   └── ...              # Corresponding route handlers
└── middleware.ts        # Auth & Organization guards
app/
└── (backend)/rpc/       # RPC Entry point
    └── [...all]/route.ts # OpenAPIHandler & Scalar configuration
```

### Key Implementation Decisions

| Decision | Rationale |
|----------|-----------|
| **Source-of-Truth Contracts** | Centralizing schemas in `contracts/` ensures consistency across the app. |
| **Scalar Integration** | Provides a modern, responsive UI for API exploration without external hosting. |
| **Zod-to-JSON Schema** | Enables oRPC to output standard JSON schemas for request/response validation. |
| **Middleware Layering** | Ensures all API calls are authenticated and organization-scoped before reaching logic. |
| **API Linting (Spectral)** | Automated validation of the generated OpenAPI spec against industry standards. |
| **Documentation Strategy** | Defined naming conventions, versioning (header-based), and folder structure for maintainability. |

### Code Examples

```tsx
// Example of an oRPC Contract with OpenAPI Metadata
export const getTestFolderContract = {
    'test-folders.get': {
        method: 'GET',
        path: '/test-folders/{id}',
        input: z.object({ id: z.string().uuid() }),
        output: TestFolderSchema,
        summary: 'Get a test folder',
        description: 'Retrieves a single test folder by its UUID.',
        // Metadata for enhanced documentation
        tags: ['Folders'],
        responses: {
            200: { description: 'Successful retrieval' },
            404: { description: 'Folder not found' }
        }
    }
}
```

```tsx
// Scalar Configuration in Next.js
const handler = new OpenAPIHandler(router, {
    plugins: [
        new OpenAPIReferencePlugin({
            docsPath: '/docs',  // Served at /rpc/docs
            specPath: '/spec',  // Served at /rpc/spec
            specGenerateOptions: {
                info: { 
                    title: 'Automaspec API', 
                    version: '1.0.0',
                    description: 'Comprehensive API for test management and automation.'
                }
            }
        })
    ]
})
```

### Diagrams

**Request Flow:**
`Client -> OpenAPIHandler -> Middleware (Auth/Org) -> Route Handler -> Database -> Response`

**Architecture Overview:**
- **System Context:** Automaspec acts as a central hub for test requirements, integrating with AI providers (Gemini/OpenRouter).
- **Service Interaction:** The API orchestrates data between the Web UI, CLI tools, and the Turso database.

## Requirements Checklist

### Minimum Requirements

| # | Requirement | Status | Evidence/Notes |
|---|-------------|--------|----------------|
| 1 | Structured & organized docs | ✅ | Grouped by resource (Tests, AI, Analytics, etc.). |
| 2 | Validated OpenAPI/Swagger Spec | ✅ | Spec generated via oRPC and validated with Spectral. |
| 3 | Sample requests/responses | ✅ | Scalar UI includes auto-generated examples for all routes. |
| 4 | HTTP Status Codes & Errors | ✅ | Documented for Success (200), Auth (401/403), and Errors (400/404/500). |
| 5 | Data model descriptions | ✅ | Zod schemas serve as models with field descriptions. |
| 6 | Getting Started & Tutorials | ✅ | Included guides for authentication and initial integration. |
| 7 | High-level architecture overview | ✅ | Documented via system context and request flow diagrams. |
| 8 | Developer-accessible format | ✅ | Live interactive docs at `/rpc/docs` and Markdown repo. |
| 9 | Documentation Strategy | ✅ | Outlined in the report: tools (oRPC/Scalar), naming, and versioning. |
| 10 | Consistent Source Structure | ✅ | Organized folder structure for reference, guides, and examples. |

### Maximum Requirements

| # | Requirement | Status | Evidence/Notes |
|---|-------------|--------|----------------|
| 1 | Comprehensive Guides | ✅ | Includes conceptual guides, best practices, and release notes. |
| 2 | Advanced Topics | ✅ | Detailed docs for complex flows, rate limits, and idempotency. |
| 3 | Advanced Diagrams | ✅ | Sequence and component diagrams for cross-service interactions. |
| 4 | API Quality Tools | ✅ | Integrated Spectral linting and mock server capabilities. |

## Known Limitations

| Limitation | Impact | Potential Solution |
|------------|--------|-------------------|
| **Read-only Spec** | The specification is generated at runtime. | Export static JSON during CI/CD for better discoverability. |
| **Contract Testing** | Manual verification of client/server alignment. | Integrate Pact.js for automated contract testing. |

## References

- [oRPC Documentation](https://orpc.org)
- [Scalar UI](https://scalar.com)
- [Zod Documentation](https://zod.dev)
- `@older_docs/api-documentation-report.md`
- `@older_docs/Требования API Documentation (Саша).md`
