# BA Requirements Preparation (Prompt)

Use this prompt to prepare the Business Analysis Requirements document for Automaspec.

## Deliverable

- A single requirements document in Markdown (`docs_requirments/BA-Requirements.md`) that can be exported to PDF.

## Minimum Requirements (Pass / Grade 5)

1. Vision, problem, and project
   - Vision statement (elevator pitch)
   - Problem statement (context + why it matters)
   - Business goals and objectives
   - Key stakeholders
2. Scope
   - In-scope
   - Out-of-scope
3. High-level solution overview
   - Proposed solution
   - High-level architecture / integration landscape
4. Features and requirements (high level)
   - Core features (epics/capabilities)
   - Functional requirements as user stories
   - Non-functional requirements
   - Regulatory / compliance needs (if applicable)
   - Use case diagram

## Maximum Requirements (Excellent / Grade 10)

Add the following sections and details:

1. Introduction
   - Purpose of the document
   - Audience
2. Vision (extended)
   - Stakeholder influence/interest matrix
   - Success criteria (KPIs / measurable outcomes)
3. Scope (extended)
   - Assumptions
   - Constraints
4. High-level solution overview (extended)
   - Alternatives considered + rationale
5. Features and requirements (extended)
   - Prioritization (e.g., MoSCoW)
   - Acceptance criteria per user story
6. Risks and dependencies
   - Key risks + mitigation strategies
   - External/internal dependencies

## Writing Guidelines

- Keep the language clear and measurable (avoid vague “should be good” phrasing).
- Ensure every requirement is testable or has explicit acceptance criteria.
- Keep terminology consistent (folder → spec → requirement → test).
- Align the content with the current repo implementation:
  - Next.js App Router, oRPC API, Better Auth orgs, Drizzle + libSQL/Turso, Vitest.

