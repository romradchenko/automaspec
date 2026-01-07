# Glossary

## Core Terms

| Term | Definition |
|------|------------|
| **Test Spec** | A test specification document containing one or more requirements and their associated tests |
| **Requirement** | A specific, testable condition or capability within a test spec |
| **Test** | An individual test case implementation that verifies a requirement |
| **Folder** | A hierarchical container for organizing test specs (supports unlimited nesting) |
| **Organization** | A multi-tenant workspace that isolates test data between teams |

## Technical Terms

| Term | Definition |
|------|------------|
| **AI SDK** | Vercel's unified SDK for interacting with multiple LLM providers |
| **Better Auth** | Open-source authentication solution used for user management |
| **Drizzle ORM** | TypeScript ORM for type-safe SQL database queries |
| **LLM** | Large Language Model (e.g., GPT-4, Claude, Gemini) |
| **oRPC** | Type-safe RPC framework for Next.js API routes |
| **Turso** | Distributed SQLite database platform (libSQL) |
| **Vitest** | Fast unit testing framework for Vite-based projects |

## Acronyms

| Acronym | Full Form | Description |
|---------|-----------|-------------|
| API | Application Programming Interface | Standard interface for software communication |
| CI/CD | Continuous Integration / Continuous Deployment | Automated build, test, and deployment pipeline |
| CRUD | Create, Read, Update, Delete | Basic data operations |
| ER | Entity Relationship | Database modeling approach |
| FAQ | Frequently Asked Questions | Common user queries |
| GDPR | General Data Protection Regulation | EU data privacy law |
| JWT | JSON Web Token | Token-based authentication standard |
| MVP | Minimum Viable Product | Initial product version with core features |
| ORM | Object-Relational Mapping | Database abstraction layer |
| RBAC | Role-Based Access Control | Permission system based on user roles |
| REST | Representational State Transfer | API architectural style |
| RPC | Remote Procedure Call | API communication pattern |
| SPA | Single Page Application | Web app architecture |
| SSR | Server-Side Rendering | HTML generated on server |
| TDD | Test-Driven Development | Development methodology |
| UI/UX | User Interface / User Experience | Design disciplines |
| WCAG | Web Content Accessibility Guidelines | Accessibility standards |

## User Roles

| Role | Definition |
|------|------------|
| **Owner** | Full control over organization, can delete org, manage all members |
| **Admin** | Can manage specs, folders, and invite members (cannot delete org) |
| **Member** | Can view and edit test specs and requirements |

## Test Statuses

| Status | Definition |
|--------|------------|
| **passed** | Test executed successfully |
| **failed** | Test execution resulted in an error or assertion failure |
| **pending** | Test is defined but not yet implemented or run |
| **skipped** | Test was intentionally skipped during execution |
| **missing** | Expected test does not exist |

## Domain-Specific Terms

### Testing

| Term | Definition |
|------|------------|
| **Test Coverage** | Percentage of code or requirements covered by tests |
| **Test Suite** | Collection of related tests |
| **Assertion** | Statement that verifies expected behavior |
| **Mocking** | Simulating external dependencies in tests |
| **E2E Testing** | End-to-end testing of complete user flows |

### AI Integration

| Term | Definition |
|------|------------|
| **Prompt Engineering** | Designing effective prompts for LLM interactions |
| **Context Window** | Maximum tokens an LLM can process in one request |
| **Token** | Unit of text processed by LLMs (roughly 4 characters) |
| **Streaming** | Receiving LLM responses incrementally as generated |
| **RAG** | Retrieval-Augmented Generation (extending LLM with external data) |
