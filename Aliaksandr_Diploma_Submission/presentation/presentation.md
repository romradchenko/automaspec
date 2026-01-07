---
marp: true
theme: default
class: default
paginate: true
backgroundColor: #ffffff
style: |
  section { font-family: 'Inter', sans-serif; font-size: 24px; }
  h1 { color: #2d3748; font-size: 1.8em; }
  h2 { color: #4a5568; font-size: 1.5em; }
  h3 { color: #4a5568; font-size: 1.2em; }
  strong { color: #3182ce; }
  ul { margin-bottom: 0; }
  p { margin-bottom: 0.5em; }
  img { max-width: 100%; height: auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-radius: 8px; }
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
<!-- 
_header: Demo Screens
-->

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center;">

<div>

1.  **Define Requirements:**
    Users create structured requirements linked to distinct test specs.
    
2.  **Sync Execution:**
    CI pipeline pushes results; coverage updates instantly.

3.  **Trace & Audit:**
    Drill down from a business goal to the specific line of code verifying it.

</div>

<div style="display: grid; grid-template-rows: 1fr 1fr; gap: 10px;">
  <img src="../assets/screenshots/prod-folder-view-desktop.png" style="border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
  <img src="../assets/screenshots/prod-dashboard-desktop.png" style="border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
</div>

</div>

---

# Demo: AI Assistance
<!-- 
_header: Demo Screens
-->

**Interactive Intelligence:**
Asking the system to generate a test case for a new login requirement.

<div style="display: flex; justify-content: center; margin-top: 20px;">
  <img src="../assets/screenshots/prod-rpc-spec-desktop.png" style="max-height: 400px; border-radius: 8px; box-shadow: 0 8px 16px rgba(0,0,0,0.1);" />
</div>

- **Context Aware:** AI knows existing schema and patterns.
- **Immediate Feedback:** Apply generated code directly to specs.

---

# High-Level Architecture

<!--
_header: Architecture
-->

<svg viewBox="0 0 900 400" xmlns="http://www.w3.org/2000/svg" style="background: transparent; max-width: 100%; height: auto;">
  <!-- Definitions for markers/shadows -->
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#4a5568"/>
    </marker>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.1"/>
    </filter>
  </defs>

  <!-- Zones Backgrounds -->
  <!-- Client Zone -->
  <rect x="20" y="50" width="180" height="300" rx="10" fill="#ebf8ff" stroke="#bee3f8" stroke-width="2" stroke-dasharray="5,5"/>
  <text x="110" y="80" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="#2c5282">Client</text>

  <!-- Cloud Zone -->
  <rect x="260" y="50" width="280" height="300" rx="10" fill="#f0fff4" stroke="#c6f6d5" stroke-width="2" stroke-dasharray="5,5"/>
  <text x="400" y="80" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="#276749">Vercel Cloud</text>

  <!-- Data Zone -->
  <rect x="600" y="50" width="280" height="300" rx="10" fill="#fff5f5" stroke="#fed7d7" stroke-width="2" stroke-dasharray="5,5"/>
  <text x="740" y="80" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="#9b2c2c">Data & AI</text>

  <!-- Nodes -->
  <!-- Browser -->
  <g transform="translate(40, 160)">
    <rect width="140" height="80" rx="6" fill="#ffffff" stroke="#3182ce" stroke-width="2" filter="url(#shadow)"/>
    <text x="70" y="35" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2d3748">Browser</text>
    <text x="70" y="55" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#718096">PWA / React</text>
  </g>

  <!-- Next.js -->
  <g transform="translate(290, 120)">
    <rect width="220" height="60" rx="6" fill="#ffffff" stroke="#38a169" stroke-width="2" filter="url(#shadow)"/>
    <text x="110" y="35" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2d3748">Next.js App Router</text>
  </g>

  <!-- ORPC -->
  <g transform="translate(290, 220)">
    <rect width="220" height="60" rx="6" fill="#ffffff" stroke="#38a169" stroke-width="2" filter="url(#shadow)"/>
    <text x="110" y="35" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2d3748">ORPC API Layer</text>
  </g>

  <!-- Turso -->
  <g transform="translate(630, 120)">
    <path d="M0,15 C0,6 30,0 70,0 S140,6 140,15 L140,45 C140,54 110,60 70,60 C30,60 0,54 0,45 Z" fill="#ffffff" stroke="#e53e3e" stroke-width="2" filter="url(#shadow)"/>
    <ellipse cx="70" cy="15" rx="70" ry="15" fill="none" stroke="#e53e3e" stroke-width="2"/>
    <text x="70" y="38" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2d3748">Turso DB</text>
    <text x="70" y="52" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#718096">libSQL / SQLite</text>
  </g>
  
  <!-- AI Provider -->
  <g transform="translate(630, 220)">
    <rect width="220" height="60" rx="6" fill="#ffffff" stroke="#805ad5" stroke-width="2" filter="url(#shadow)"/>
    <text x="110" y="25" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2d3748">AI Provider</text>
    <text x="110" y="45" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#718096">Google / OpenAI</text>
  </g>

  <!-- Connections -->
  <!-- Browser <-> Next -->
  <path d="M180,200 L280,150" stroke="#4a5568" stroke-width="2" marker-end="url(#arrowhead)"/>
  <path d="M280,150 L180,200" stroke="#4a5568" stroke-width="2" marker-end="url(#arrowhead)" stroke-dasharray="3,3" opacity="0.5"/> 

  <!-- Browser <-> ORPC (Indirect/Conceptual flow or via Next) -->
  <path d="M180,200 L280,250" stroke="#4a5568" stroke-width="2" marker-end="url(#arrowhead)"/>

  <!-- Next <-> ORPC (Internal) -->
  <line x1="400" y1="180" x2="400" y2="220" stroke="#4a5568" stroke-width="2" stroke-dasharray="4,4"/>

  <!-- ORPC <-> DB -->
  <path d="M510,250 L620,150" stroke="#4a5568" stroke-width="2" marker-end="url(#arrowhead)"/>
  
  <!-- ORPC <-> AI -->
  <path d="M510,250 L620,250" stroke="#4a5568" stroke-width="2" marker-end="url(#arrowhead)"/>

</svg>

**Key Components:**
- **Frontend:** Next.js 15 (React 19), Tailwind CSS, Framer Motion.
- **Backend:** Serverless Functions via Vercel, ORPC for type-safe contracts.
- **Database:** Distributed SQLite (Turso) managed via Drizzle ORM.
- **AI Integration:** Vercel AI SDK connecting to LLM providers.

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
