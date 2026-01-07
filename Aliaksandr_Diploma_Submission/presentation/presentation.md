---
marp: true
size: 16:9
paginate: true
backgroundColor: #ffffff
style: |
  section {
    font-family: 'Inter', sans-serif;
    font-size: 24px;
    padding: 40px;
    color: #2d3748;
    background-color: #ffffff;
  }
  h1 { color: #1a202c; font-size: 1.8em; margin-bottom: 0.5em; }
  h2 { color: #2d3748; font-size: 1.4em; margin-bottom: 0.5em; }
  h3 { color: #4a5568; font-size: 1.1em; }
  strong { color: #3182ce; }
  ul { margin-bottom: 0.5em; padding-left: 1em; }
  li { margin-bottom: 0.3em; }
  p { margin-bottom: 0.6em; }
  img { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
  
  /* Pretty Blockquote */
  blockquote {
    background: #f7fafc;
    border-left: 6px solid #3182ce;
    margin: 1em 0;
    padding: 0.8em 1.2em;
    font-style: italic;
    color: #4a5568;
    border-radius: 4px;
  }

  /* Table Styling */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1em;
    font-size: 0.9em;
  }
  th {
    background: #edf2f7;
    color: #2d3748;
    font-weight: bold;
    text-align: left;
    padding: 12px;
    border-bottom: 2px solid #cbd5e0;
  }
  td {
    padding: 10px;
    border-bottom: 1px solid #e2e8f0;
  }
  tr:nth-child(even) { background-color: #f7fafc; }

  /* Title Slide */
  section.lead {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    text-align: left;
    background: linear-gradient(135deg, #ebf8ff 0%, #ffffff 100%);
  }
---
<!-- _class: lead -->

# **AutomaSpec**
## Intelligent Test Management System

<br>

**Student:** Aliaksandr
**Group:** [Group Number]
**Supervisor:** [Supervisor Name]
**Date:** 2026

---

# The Problem: Testing Fragmentation

**Who suffers?**
QA Engineers, Developers, and Product Managers in fast-paced teams.

**The Reality:**
- ❌ **Disconnected Workflows:** Requirements live in docs, tests live in code. Links are manual and fragile.
- ❌ **Visibility Black Holes:** Stakeholders cannot verify if a specific requirement is actually covered by a passing test.
- ❌ **Stale Documentation:** Test cases often lag behind code changes, leading to false confidence.
- ❌ **Manual & Slow:** meaningful reporting requires manual spreadsheet updates.

> *"We don't know if we broke the feature until users tell us."*

---

# The Solution: Unified Test Lifecycle

**How AutomaSpec solves it:**
AutomaSpec acts as the **central nervous system** for quality assurance, syncing code, tests, and requirements.

**Key Capabilities:**
- 🔗 **Deep Integration:** Automatically syncs Playwright & Vitest execution results to requirements.
- 📋 **Live Traceability:** Requirement $\leftrightarrow$ Test Spec $\leftrightarrow$ Execution Result. All linked.
- 🤖 **AI Assistant:** Chat with your test suite to generate cases or explain failures.

**Why it's different:**
Unlike erratic spreadsheets or siloed Jira plugins, AutomaSpec represents the **state of truth directly from CI/CD**.

---

# Demo: Core Workflow

1.  **Define Requirements:**
    Users create requirements linked to specs.
    
2.  **Sync Execution:**
    CI pipeline pushes results; coverage updates instantly.

3.  **Trace & Audit:**
    Drill down from a business goal to the specific test.

![bg right:60% fit](../assets/screenshots/prod-folder-view-desktop.png)

---

# Demo: AI Assistance

**Interactive Intelligence:**
Asking the system to generate a test case for a new login requirement.

- **Context Aware:** AI knows existing schema.
- **Immediate Feedback:** Apply code direct to specs.

![bg right:50% fit](../assets/screenshots/prod-rpc-spec-desktop.png)

---

# High-Level Architecture

**Key Components:**

- **Frontend:** Next.js 15 (React 19), Tailwind CSS, Framer Motion.
- **Backend:** Serverless Functions via Vercel, ORPC for type-safe contracts.
- **Database:** Distributed SQLite (Turso) managed via Drizzle ORM.
- **AI Integration:** Vercel AI SDK into Google/OpenAI.

![bg right:55% fit](../assets/architecture.png)

---

# Technology Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15** | Full-stack React framework with App Router |
| **Language** | **TypeScript** | Strict type safety across full stack |
| **Database** | **Turso (LibSQL)** | Edge-compatible distributed SQLite |
| **ORM** | **Drizzle ORM** | Type-safe SQL builder and schema management |
| **API** | **ORPC** | End-to-end type-safe API contracts |
| **Testing** | **Playwright + Vitest** | E2E and Unit testing frameworks |
| **Styling** | **Tailwind CSS v4** | Utility-first styling with motion primitives |
