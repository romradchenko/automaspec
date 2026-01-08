#!/usr/bin/env bash
# Script to generate a unified PDF for Roman Radchenko's Diploma Submission

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$SCRIPT_DIR"
DOCS_DIR="$ROOT_DIR"
COMBINED_MD="$ROOT_DIR/combined_documentation.md"
OUTPUT_PDF="$ROOT_DIR/Radchenko_Documentation.pdf"

FILES=(
    "index.md"
    "01-project-overview/index.md"
    "01-project-overview/problem-and-goals.md"
    "01-project-overview/stakeholders.md"
    "01-project-overview/scope.md"
    "01-project-overview/features.md"
    "02-technical/index.md"
    "02-technical/tech-stack.md"
    "02-technical/buisiness-analysis/business-analysis.md"
    "02-technical/backend/backend.md"
    "02-technical/databases/databases.md"
    "02-technical/qualiative-quantitive-testing/testing.md"
    "02-technical/ai-assistant/ai-assistant.md"
    "02-technical/deployment.md"
    "03-user-guide/index.md"
    "03-user-guide/features.md"
    "03-user-guide/faq.md"
    "04-retrospective/index.md"
    "appendices/glossary.md"
    "appendices/api-reference.md"
    "appendices/db-schema.md"
)

echo "Combining Markdown files..."
> "$COMBINED_MD"

for file in "${FILES[@]}"; do
    filepath="$DOCS_DIR/$file"
    if [[ -f "$filepath" ]]; then
        echo "Adding: $file"
        cat "$filepath" >> "$COMBINED_MD"
        echo -e "\n\n---\n\n" >> "$COMBINED_MD"
    else
        echo "Warning: File not found - $filepath"
    fi
done

echo "Generating PDF with md-to-pdf..."

if command -v npx &> /dev/null; then
    npx md-to-pdf "$COMBINED_MD"
    
    if [[ $? -eq 0 ]]; then
        mv "${COMBINED_MD%.md}.pdf" "$OUTPUT_PDF"
        echo "PDF generated successfully: $OUTPUT_PDF"
        rm -f "$COMBINED_MD"
    else
        echo "Error: PDF generation failed"
        exit 1
    fi
else
    echo "Error: npx is not installed"
    exit 1
fi
