# Automaspec — Final Presentation

**Project:** Automaspec  
**Students:** Roman Radchenko & Aliaksandr Samatiya  
**Technology:** JavaScript (TypeScript)  
**Supervisor:** Volha Kuzniatsova  
**Submission Date:** 05.01.2026

---

## Slide Structure (18-24 slides, 16:9 format)

---

### Slide 1: Title

**AUTOMASPEC**

AI-Powered Test Specification & Automation Platform

---

Roman Radchenko & Aliaksandr Samatiya

JavaScript • Supervisor: Volha Kuzniatsova • 05.01.2026

---

**Links:**
- Production: https://automaspec.vercel.app
- Repository: https://github.com/qweered/automaspec
- API Docs: https://automaspec.vercel.app/rpc/docs

---

### Slide 2: The Problem (1/2)

**Test Documentation Chaos**

Modern development teams struggle with:

| Problem | Impact |
|---------|--------|
| 📁 Scattered documentation | Jira, Confluence, Excel, code comments |
| ⏱️ Manual test creation | Time-consuming, repetitive work |
| 🏗️ No standardized structure | Inconsistent organization |
| 👁️ Poor visibility | No real-time test status tracking |

---

### Slide 3: The Problem (2/2)

**Business Impact**

- ⬆️ Increased time-to-market
- 💰 Higher maintenance costs
- 🐛 Reduced test coverage → Quality issues
- 😤 Team inefficiency

**Result:** Disconnect between test documentation and CI/CD execution

---

### Slide 4: The Solution (1/2)

**Automaspec: Single Source of Truth**

Centralized AI-powered test management platform

```
📁 Folders
  └── 📋 Specs
       └── ✅ Requirements
            └── 🧪 Tests
```

- Hierarchical organization
- Multi-tenant workspaces
- AI-powered assistance
- CI/CD integration

---

### Slide 5: The Solution (2/2)

**Key Features**

| Feature | Benefit |
|---------|---------|
| 🤖 AI Assistant | Create folders, specs, requirements via chat |
| 📊 Analytics Dashboard | Real-time test health metrics |
| 🔄 CI/CD Sync | Automatic test result updates |
| 👥 Organizations | Team collaboration with roles |

---

### Slide 6: Demo — Dashboard

**Screenshot: Dashboard with folder tree and spec details**

*(Use screenshot from docs_requirments/screenshots-prod/dashboard-*.png)*

- Left: Folder tree navigation
- Right: Spec details with requirements
- Toolbar: CRUD actions

---

### Slide 7: Demo — AI Assistant

**Screenshot: AI chat interface**

*(Use screenshot from docs_requirments/screenshots-prod/ai-*.png)*

- Natural language commands
- Tool-assisted actions
- Session history
- Provider selection

---

### Slide 8: Demo — Analytics

**Screenshot: Analytics dashboard with charts**

*(Use screenshot from docs_requirments/screenshots-prod/analytics-*.png)*

- Metrics cards (tests, specs, requirements, members)
- Tests growth line chart
- Status distribution bar chart
- Stale tests table

---

### Slide 9: Architecture (1/2)

**Tech Stack**

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, Tailwind v4 |
| **Backend** | oRPC, Better Auth, Zod |
| **Database** | Turso (SQLite), Drizzle ORM |
| **AI** | AI SDK, OpenRouter, Gemini |
| **Deployment** | Vercel, Docker, GitHub Actions |

---

### Slide 10: Architecture (2/2)

**System Diagram**

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   oRPC      │────▶│   Turso     │
│  Next.js    │◀────│   Routes    │◀────│  (SQLite)   │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   AI SDK    │
                    └─────────────┘
```

---

### Slide 11: Criterion — Business Analysis (9/10)

**ADR: BA Documentation**

- ✅ Vision & problem statement
- ✅ Stakeholder analysis (7 stakeholders mapped)
- ✅ Success criteria with 6 KPIs
- ✅ Scope definition (in/out)
- ✅ User stories and use cases

---

### Slide 12: Criterion — Backend (9/10)

**ADR: oRPC + Better Auth**

- ✅ Type-safe RPC with auto OpenAPI
- ✅ Session-based authentication
- ✅ Organization-scoped middleware
- ✅ Zod validation on all endpoints
- ✅ Structured logging (Pino)

---

### Slide 13: Criterion — Frontend + Adaptive UI (10/10)

**ADR: Next.js + Tailwind**

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ SPA-like navigation
- ✅ Radix UI accessible components
- ✅ TanStack Query for server state
- ✅ Dark/light theme support

---

### Slide 14: Criterion — CI/CD + Containerization (9/10)

**ADR: GitHub Actions + Docker**

- ✅ Automated linting, formatting, testing
- ✅ Preview deployments on PRs
- ✅ Production deployment on main
- ✅ Multi-stage Dockerfile
- ✅ Non-root container runtime

---

### Slide 15: Criterion — API Documentation (9/10)

**ADR: Scalar + OpenAPI**

- ✅ Auto-generated OpenAPI spec
- ✅ Interactive Scalar UI
- ✅ Multi-language code examples
- ✅ Authentication flow documented

**Live:** https://automaspec.vercel.app/rpc/docs

---

### Slide 16: Criterion — Database (8/10)

**ADR: Turso + Drizzle ORM**

- ✅ OLTP transactional database
- ✅ Normalized schema (3NF)
- ✅ Cascading deletes
- ✅ Type-safe queries
- ✅ Multi-tenancy isolation

---

### Slide 17: Criterion — AI + Analytics + Tests (10/10)

**ADR: AI SDK + Recharts + Vitest**

- ✅ Chat interface with tool actions
- ✅ Safety controls (guards, rate limiting)
- ✅ Analytics dashboard with visualizations
- ✅ Unit, integration, E2E tests
- ✅ Coverage reporting

---

### Slide 18: Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Real-time analytics (scored 5) | Polling-based with period selection |
| AI abuse prevention | Per-org rate limiting + prompt guards |
| Data isolation | Organization middleware on all routes |
| Bundle size | Code splitting, tree shaking |

**Technical Debt:** In-memory rate limiter → Redis needed for production

---

### Slide 19: Results

**Achievements**

| Metric | Result |
|--------|--------|
| Test creation speed | ~30% faster with AI |
| Platform deployment | Production on Vercel |
| API documentation | Auto-generated, live |
| Test coverage | Unit + E2E tests |

**Production:** https://automaspec.vercel.app

---

### Slide 20: Q&A

**Questions?**

---

**Contact:**
- Roman Radchenko
- Aliaksandr Samatiya

**Resources:**
- https://automaspec.vercel.app
- https://github.com/qweered/automaspec
- https://automaspec.vercel.app/rpc/docs

---

## Presentation Notes

### Format Requirements
- **Slides:** 18-24 (this outline has 20)
- **Aspect Ratio:** 16:9
- **Format:** .pptx or .pdf
- **Language:** English

### Screenshots to Include
From `docs_requirments/screenshots-prod/`:
- `dashboard-desktop.png`
- `ai-chat.png`
- `analytics-overview.png`
- `login-desktop.png`
- `scalar-overview.png`

### Speaking Time
- ~2-3 minutes per slide section
- Total: ~30-45 minutes including demo
