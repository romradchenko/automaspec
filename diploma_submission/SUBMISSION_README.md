# Diploma Submission Package

## Final ZIP Archive Structure

```
automaspec-diploma-submission.zip
├── documentation/
│   ├── docs/
│   │   ├── index.md                     # Title page with project info
│   │   ├── 01-project-overview/         # BA section
│   │   │   ├── index.md
│   │   │   ├── problem-and-goals.md
│   │   │   ├── stakeholders.md
│   │   │   ├── scope.md
│   │   │   └── features.md
│   │   ├── 02-technical/                # Technical section
│   │   │   ├── index.md
│   │   │   ├── tech-stack.md
│   │   │   ├── deployment.md
│   │   │   └── criteria/                # 7 ADR files
│   │   │       ├── ba.md
│   │   │       ├── backend.md
│   │   │       ├── frontend.md
│   │   │       ├── cicd.md
│   │   │       ├── api-docs.md
│   │   │       ├── database.md
│   │   │       └── ai-analytics-tests.md
│   │   ├── 03-user-guide/               # User guide
│   │   │   ├── index.md
│   │   │   ├── features.md
│   │   │   └── faq.md
│   │   ├── 04-retrospective/            # Retrospective
│   │   │   └── index.md
│   │   ├── appendices/
│   │   └── assets/
│   │       └── images/                  # Screenshots
│   └── mkdocs.yml
├── presentation/
│   ├── PRESENTATION.md                  # Slide outline
│   └── automaspec-presentation.pptx     # PowerPoint file (to create)
├── video/
│   ├── VIDEO_SCRIPT.md                  # Video script
│   └── automaspec-demo.mp4              # Demo video (to record)
└── source-code/
    └── automaspec/                      # Repository snapshot
        ├── app/
        ├── components/
        ├── db/
        ├── lib/
        ├── orpc/
        ├── __tests__/
        ├── package.json
        ├── README.md
        └── ... (exclude node_modules, .env, .next)
```

---

## Submission Checklist

### Documentation (32,000–51,500 characters)
- [x] Title page with project info and links
- [x] Project Overview section (~8,000–12,000 chars)
- [x] Technical section with 7 criteria ADRs (~15,000–25,000 chars)
- [x] User Guide section (~5,000–8,000 chars)
- [x] Retrospective section (~3,000–5,000 chars)
- [ ] All screenshots copied to assets/images/
- [ ] Generate PDF from markdown

### Presentation (18–24 slides)
- [x] Slide outline created (PRESENTATION.md)
- [ ] Create PowerPoint/Google Slides from outline
- [ ] Add screenshots from docs_requirments/screenshots-prod/
- [ ] Export as .pptx or .pdf

### Video (30s–2min)
- [x] Script created (VIDEO_SCRIPT.md)
- [ ] Record screen demo
- [ ] Record narration
- [ ] Edit and export as .mp4 (1080p)

### Source Code
- [ ] Clean repository snapshot
- [ ] Remove node_modules, .env, .next, coverage
- [ ] Include README with setup instructions

---

## Quick Commands

### Generate PDF (VS Code Extension)
1. Open any .md file
2. `Ctrl+Shift+P` → "Markdown PDF: Export (pdf)"

### Generate PDF (Pandoc)
```bash
cd diploma_submission/documentation
pandoc docs/**/*.md -o automaspec-documentation.pdf --toc --toc-depth=2
```

### Create ZIP Archive
```powershell
# From project root
Compress-Archive -Path diploma_submission/* -DestinationPath automaspec-diploma-submission.zip
```

### Export Source Code
```powershell
# Create clean copy
git archive --format=zip --output=source-code/automaspec.zip HEAD
```

---

## Project URLs

| Resource | URL |
|----------|-----|
| Production | https://automaspec.vercel.app |
| Repository | https://github.com/qweered/automaspec |
| API Docs | https://automaspec.vercel.app/rpc/docs |
| OpenAPI Spec | https://automaspec.vercel.app/rpc/spec |

---

## Evaluation Criteria Summary

| # | Criterion | Score | ADR File |
|---|-----------|-------|----------|
| 1 | Business Analysis | 9 | ba.md |
| 2 | Backend | 9 | backend.md |
| 3 | Frontend + Adaptive UI | 10 | frontend.md |
| 4 | CI/CD + Containerization | 9 | cicd.md |
| 5 | API Documentation | 9 | api-docs.md |
| 6 | Database | 8 | database.md |
| 7 | AI + Analytics + Tests | 10 | ai-analytics-tests.md |

---

## Team

- **Roman Radchenko** — Developer
- **Aliaksandr Samatiya** — Developer
- **Volha Kuzniatsova** — Supervisor

**Submission Date:** 05.01.2026
