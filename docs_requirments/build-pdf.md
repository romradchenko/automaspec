## Prerequisites

- `pandoc`
- A LaTeX engine (`xelatex` recommended)
- Optional: a Mermaid filter (`mermaid-filter`) if you want Mermaid blocks rendered into diagrams in the PDF

All commands below assume you run them from the repository root unless stated otherwise.

## Windows (PowerShell)

```powershell
cd docs_requirments

$commonArgs = @(
  '--pdf-engine=xelatex',
  '-V', 'lang=en-US',
  '-V', 'mainfont=Times New Roman',
  '-V', 'monofont=Consolas',
  '--variable=geometry:margin=1cm'
)

pandoc @commonArgs -o adaptive-ui-documentation.pdf adaptive-ui-documentation.md
pandoc @commonArgs -o ai-assistant-requirements-report.pdf ai-assistant-requirements-report.md
pandoc @commonArgs -o analytics-report.pdf analytics-report.md
pandoc @commonArgs -o api-documentation-report.pdf api-documentation-report.md
pandoc @commonArgs -o backend-report.pdf backend-report.md
pandoc @commonArgs -o ci-cd-infrastructure-report.pdf ci-cd-infrastructure-report.md
pandoc @commonArgs -o containerization-requirements-report.pdf containerization-requirements-report.md
pandoc @commonArgs -o database-report.pdf database-report.md
pandoc @commonArgs -o frontend-report.pdf frontend-report.md
pandoc @commonArgs -o requirements.pdf requirements.md
```

## Linux/macOS

```bash
cd docs_requirments

COMMON_ARGS=(
  --pdf-engine=xelatex
  -V lang=en-US
  -V mainfont="Times New Roman"
  -V monofont="Consolas"
  --variable=geometry:margin=1cm
)

pandoc "${COMMON_ARGS[@]}" -o adaptive-ui-documentation.pdf adaptive-ui-documentation.md
pandoc "${COMMON_ARGS[@]}" -o ai-assistant-requirements-report.pdf ai-assistant-requirements-report.md
pandoc "${COMMON_ARGS[@]}" -o analytics-report.pdf analytics-report.md
pandoc "${COMMON_ARGS[@]}" -o api-documentation-report.pdf api-documentation-report.md
pandoc "${COMMON_ARGS[@]}" -o backend-report.pdf backend-report.md
pandoc "${COMMON_ARGS[@]}" -o ci-cd-infrastructure-report.pdf ci-cd-infrastructure-report.md
pandoc "${COMMON_ARGS[@]}" -o containerization-requirements-report.pdf containerization-requirements-report.md
pandoc "${COMMON_ARGS[@]}" -o database-report.pdf database-report.md
pandoc "${COMMON_ARGS[@]}" -o frontend-report.pdf frontend-report.md
pandoc "${COMMON_ARGS[@]}" -o requirements.pdf requirements.md
```
