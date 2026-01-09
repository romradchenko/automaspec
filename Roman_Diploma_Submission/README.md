# Automaspec - Diploma Documentation

## Student Information

| Field | Value |
|-------|-------|
| **Student** | Roman Radchenko |
| **Group** | JS |
| **Supervisor** | Volha Kuzniatsova |
| **Submission Date** | January 7, 2026 |

## Project Overview

**Automaspec** is an AI-powered test specification and automation platform that helps QA engineers and developers organize test documentation, create specifications using AI assistant, and track test coverage in a centralized location.

### Key Features

- Hierarchical test organization (Folders → Specs → Requirements → Tests)
- AI assistant for creating specifications, organizing structure, and managing requirements
- Multi-organization support with role-based access
- Real-time test status tracking
- CI/CD integration with GitHub Actions

## Links

| Resource | URL |
|----------|-----|
| **Production** | [https://automaspec.vercel.app](https://automaspec.vercel.app) |
| **API Documentation** | [https://automaspec.vercel.app/rpc/docs](https://automaspec.vercel.app/rpc/docs) |
| **Repository** | [GitHub](https://github.com/automaspec/automaspec) |

## Evaluation Criteria

| # | Criterion | Documentation |
|---|-----------|---------------|
| 1 | Business Analysis | [02-technical/buisiness-analysis/business-analysis.md](02-technical/buisiness-analysis/business-analysis.md) |
| 2 | Backend Development | [02-technical/backend/backend.md](02-technical/backend/backend.md) |
| 3 | Database Design | [02-technical/databases/databases.md](02-technical/databases/databases.md) |
| 4 | Qualitative/Quantitative Testing | [02-technical/qualiative-quantitive-testing/testing.md](02-technical/qualiative-quantitive-testing/testing.md) |
| 5 | AI Assistant / Chatbot | [02-technical/ai-assistant/ai-assistant.md](02-technical/ai-assistant/ai-assistant.md) |

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TailwindCSS v4 |
| Backend | oRPC, Drizzle ORM |
| Database | Turso (distributed SQLite) |
| AI | Vercel AI SDK, OpenRouter, Gemini |
| Authentication | Better Auth |
| Hosting | Vercel |
| Testing | Vitest, React Testing Library, Playwright |

## Documentation Structure

```
Roman_Diploma_Submission/
├── index.md                          # Title page
├── 01-project-overview/              # Business Analysis
│   ├── index.md                      # Executive summary
│   ├── problem-and-goals.md          # Problem statement, goals, KPIs
│   ├── stakeholders.md               # Target audience analysis
│   ├── scope.md                      # In/Out scope, constraints
│   └── features.md                   # Epics, user stories
├── 02-technical/                     # Technical Implementation
│   ├── index.md                      # Architecture overview
│   ├── tech-stack.md                 # Technology decisions
│   ├── deployment.md                 # CI/CD, deployment
│   ├── buisiness-analysis/           # Criterion 1
│   ├── backend/                      # Criterion 2
│   ├── databases/                    # Criterion 3
│   ├── qualiative-quantitive-testing/# Criterion 4
│   └── ai-assistant/                 # Criterion 5
├── 03-user-guide/                    # User Documentation
│   ├── index.md                      # Getting started
│   ├── features.md                   # Feature walkthrough
│   └── faq.md                        # FAQ & troubleshooting
├── 04-retrospective/                 # Project Retrospective
│   └── index.md                      # Lessons learned
├── appendices/                       # Reference Material
│   ├── glossary.md                   # Terms & definitions
│   ├── api-reference.md              # API documentation
│   └── db-schema.md                  # Database schema
├── assets/                           # Media Files
│   ├── screenshots/                  # Application screenshots
│   └── diagrams/                     # Architecture diagrams
└── mkdocs.yml                        # MkDocs configuration
```

## How to View Documentation

### Option 1: Read Markdown Files Directly

All documentation is in Markdown format and can be read directly in any text editor, IDE, or GitHub.

### Option 2: Build with MkDocs

```bash
# Install MkDocs with Material theme
pip install mkdocs mkdocs-material

# Serve locally
cd Roman_Diploma_Submission
mkdocs serve

# Open http://localhost:8000
```

### Option 3: Generate PDF

```bash
# Using Pandoc
pandoc index.md 01-project-overview/*.md 02-technical/*.md \
  03-user-guide/*.md 04-retrospective/*.md appendices/*.md \
  -o Radchenko_Documentation.pdf --toc

# Or use VS Code "Markdown PDF" extension
```

## Running the Application

### Prerequisites

- Node.js 24+
- pnpm (via corepack)
- Turso database or local libSQL

### Setup

```bash
# Clone repository
git clone https://github.com/automaspec/automaspec
cd automaspec

# Install dependencies
corepack enable pnpm
pnpm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your database credentials

# Run migrations
pnpm dbup

# Start development server
pnpm dev
```

### Docker

```bash
# Development
pnpm docker:dev:up

# Production
pnpm docker:prod:up
```

## Submission Contents

| Component | Format | Location |
|-----------|--------|----------|
| Documentation (MD) | .md files | This folder |
| Documentation (PDF) | .pdf | `Radchenko_Documentation.pdf` |
| Source Code | Repository | [GitHub](https://github.com/automaspec/automaspec) |
| Presentation | .pptx/.pdf | `presentation/` folder |
| Demo Video | .mp4 or link | `video/` folder |

## Contact

- **Student**: Roman Radchenko
- **Email**: [Your email]
- **GitHub**: [Your GitHub profile]

---

*Diploma Project - January 2026*
