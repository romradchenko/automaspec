# Diploma Project Documentation Guide

## What Is This

The project documentation is a technical document describing your diploma project in an industry-standard format. This is not an academic essay with a "literature review" — it's a real document that could be used in an IT company: problem description, architectural decisions, user manual, and honest analysis of results.

**Format:** Markdown (.md files) → PDF generation

**Why Markdown:**
- Stored in Git alongside your code
- Easy to edit and version control
- Convenient for working with AI assistants
- Automatic PDF generation

---

## Template

📦 **Download template:** [GitHub repository link]

The template contains a ready-made folder structure and files with placeholders — you just need to fill them with your content.

---

## Document Structure

```
docs/
├── index.md                    # Title page
├── 01-project-overview/        # Section 1: Project Overview (BA)
│   ├── index.md               
│   ├── problem-and-goals.md   
│   ├── stakeholders.md        
│   ├── scope.md               
│   └── features.md            
├── 02-technical/               # Section 2: Technical Implementation
│   ├── index.md               
│   ├── tech-stack.md          
│   ├── criteria/               # ← Your 7 criteria
│   │   ├── [criterion-1].md
│   │   ├── [criterion-2].md
│   │   └── ...
│   └── deployment.md          
├── 03-user-guide/              # Section 3: User Guide
│   ├── index.md               
│   ├── features.md            
│   └── faq.md                 
├── 04-retrospective/           # Section 4: Retrospective
│   └── index.md               
└── assets/                     # Images and diagrams
    └── images/
```

---

## Step-by-Step Workflow

### Step 1: Preparation

1. Download the template from GitHub
2. Create your own repository or folder for documentation
3. Copy the template structure
4. Install PDF generation tools (see "PDF Generation" section)

### Step 2: Title Page

Fill in `index.md`:
- Project name
- Your details (full name, group, supervisor)
- Links to production, repository, Figma
- List of selected criteria

### Step 3: Project Overview

Fill in the `01-project-overview/` section:

| File | What to Write |
|------|---------------|
| `index.md` | Executive Summary, links |
| `problem-and-goals.md` | Problem, user pain points, goals and KPIs |
| `stakeholders.md` | Target audience, personas |
| `scope.md` | In/Out Scope, constraints, assumptions |
| `features.md` | Epics, User Stories, Use Case diagram |

### Step 4: Technical Implementation

Fill in the `02-technical/` section:

| File | What to Write |
|------|---------------|
| `index.md` | Architecture diagram, component overview |
| `tech-stack.md` | Technology table with justification |
| `criteria/*.md` | 1 file for each of 7 criteria |
| `deployment.md` | CI/CD, how to run the project |

**For each criterion, use the ADR structure:**
- Context (what problem you were solving)
- Decision (what you chose)
- Alternatives (what else you considered)
- Requirements compliance checklist

### Step 5: User Guide

Fill in the `03-user-guide/` section:
- Getting Started — how to start using the app
- Features — step-by-step scenarios with screenshots
- FAQ — common problems and solutions

### Step 6: Retrospective

Fill in `04-retrospective/index.md`:
- What went well
- What didn't work and why (be honest!)
- Technical Debt — known issues
- Lessons Learned — conclusions and takeaways

### Step 7: Finalization

1. Check all links and images
2. Make sure all placeholders are filled in
3. Generate PDF
4. Check PDF for readability
5. Prepare the submission archive

---

## Volume Recommendations

Since the document is in Markdown, focus on **character count**, not pages.

| Section | Characters | ≈ A4 Pages |
|---------|------------|------------|
| **Title Page** | 1,000–1,500 | 0.5 |
| **Project Overview** | 8,000–12,000 | 4–6 |
| **Technical** (including 7 criteria) | 15,000–25,000 | 8–12 |
| **User Guide** | 5,000–8,000 | 3–4 |
| **Retrospective** | 3,000–5,000 | 1.5–2.5 |
| **TOTAL** | **32,000–51,500** | **17–25** |

### Volume Per Criterion

Each criterion: **2,000–3,500 characters** (≈ 1–1.5 pages)

```
ADR (Architecture Decision Record)
├── Context: 200–400 characters
├── Decision: 200–400 characters
├── Alternatives: table with 3–4 rows
└── Consequences: 200–300 characters

Implementation
├── Key decisions: 3–5 bullet points
└── Structure/diagram: if applicable

Checklist: table with 5–10 rows
```

### What NOT to Write

❌ Literature review and technology history  
❌ Copy-paste from framework documentation  
❌ Abstract reasoning about the importance of IT  
❌ Duplicating information between sections  

### What to Write

✅ Specifics about YOUR project  
✅ Justification of YOUR decisions  
✅ Screenshots and diagrams of YOUR application  
✅ Honest analysis of results  

---

## PDF Generation

### Option 1: VS Code + Extension (easiest)

1. Install the **"Markdown PDF"** extension in VS Code
2. Open any .md file
3. `Ctrl+Shift+P` → "Markdown PDF: Export (pdf)"

### Option 2: Pandoc (universal)

```bash
# Installation
# Windows: choco install pandoc
# macOS: brew install pandoc
# Linux: sudo apt install pandoc

# Generate PDF from all files
pandoc docs/**/*.md -o diploma-project.pdf --toc --toc-depth=2
```

### Option 3: MkDocs (advanced)

```bash
# Installation
pip install mkdocs mkdocs-material mkdocs-pdf-export-plugin

# Generation
ENABLE_PDF_EXPORT=1 mkdocs build
```

---

## Submission Format

Submit **one ZIP archive** with the following structure:

```
[LastName]_[FirstName]_Diploma.zip
│
├── 📁 documentation/
│   ├── 📁 docs/                    # MD source files
│   │   ├── index.md
│   │   ├── 01-project-overview/
│   │   ├── 02-technical/
│   │   ├── 03-user-guide/
│   │   ├── 04-retrospective/
│   │   └── assets/
│   │
│   └── 📄 [LastName]_Documentation.pdf
│
├── 📁 source-code/
│   ├── 📦 backend.zip              # Backend repository
│   ├── 📦 frontend.zip             # Frontend repository
│   └── 📦 [other].zip              # Other repositories (if any)
│
├── 📁 presentation/
│   └── 📄 [LastName]_Presentation.pptx
│
└── 📁 video/
    └── 📄 [LastName]_Demo.mp4      # Or link in README
```

### Component Requirements

| Component | Format | Requirements |
|-----------|--------|--------------|
| **Documentation (MD)** | .md files | Completed template, all sections |
| **Documentation (PDF)** | .pdf | Generated from MD, readable |
| **Code** | .zip | Each repository as a separate archive |
| **Presentation** | .pptx/.pdf | [Requirements](PRESENTATION.md) |
| **Video** | .mp4 or link | Format will be described separately |

### File Naming

- Use Latin characters: `Ivanov_Ivan_Diploma.zip`
- No spaces: use `_` or `-`
- Put your last name first

---

## Pre-Submission Checklist

### Documentation
- [ ] All template sections are filled in
- [ ] No placeholders like `[Name]` or `[description]`
- [ ] All links work
- [ ] Images are displayed correctly
- [ ] PDF is generated and readable
- [ ] All 7 criteria are listed

### Code
- [ ] Each repository in a separate ZIP
- [ ] README with run instructions exists
- [ ] No secrets in code (passwords, API keys)
- [ ] .env.example is present
- [ ] Code runs successfully

### General
- [ ] Archive structure matches requirements
- [ ] Files are named correctly
- [ ] Archive opens without errors

---

## FAQ

**Q: Can I write in Russian?**  
A: The documentation should be in English. Code and code comments should also be in English.

**Q: Is it mandatory to use this exact template?**  
A: Yes, the structure is mandatory. You may adapt minor visual styling, but the overall structure must be followed.

**Q: What if a criterion is not fully completed?**  
A: Honestly mark the checklist status as ⚠️ (partial) and explain in the Retrospective section what wasn't completed and why.

**Q: Can I add additional sections?**  
A: Any additions or modifications to the template structure must be discussed with and approved by your supervisor. Do not add extra sections without explicit permission.

**Q: Can I remove sections that don't apply to my project?**  
A: No. All sections are required. If something doesn't apply, briefly explain why in that section rather than removing it.

**Q: How do I handle large images or videos?**  
A: Optimize image file sizes. For videos, you may use a link to YouTube or Google Drive instead of embedding the file.

**Q: What if my project has multiple repositories?**  
A: Create a separate ZIP for each repository. Name them clearly (e.g., `backend.zip`, `frontend.zip`, `mobile.zip`).

**Q: Can I use a different PDF generation tool?**  
A: Yes, as long as the final PDF is readable and properly formatted. The three options listed are recommendations.

**Q: What language should code comments be in?**  
A: English. All code, comments, variable names, and commit messages should be in English.

**Q: How detailed should the User Guide be?**  
A: Detailed enough for someone unfamiliar with your project to understand how to use it. Include screenshots for key features.

---

## Support

If you have questions:
1. Re-read this guide carefully
2. Check the examples in the template
3. Contact your supervisor

---

*Good luck with your diploma! 🎓*
