#!/usr/bin/env bash
# Script to generate a unified PDF for Aliaksandr Samatyia's Diploma Submission

ROOT_DIR="/home/qweered/Projects/automaspec/Aliaksandr_Diploma_Submission"
COMBINED_MD="$ROOT_DIR/combined_documentation.md"
OUTPUT_PDF="$ROOT_DIR/Aliaksandr_Samatyia_Documentation.pdf"
TEMP_HTML="$ROOT_DIR/temp_documentation.html"

# List of files in order from mkdocs.yml
FILES=(
    "index.md"
    "01-project-overview/index.md"
    "01-project-overview/problem-and-goals.md"
    "01-project-overview/stakeholders.md"
    "01-project-overview/scope.md"
    "01-project-overview/features.md"
    "02-technical/index.md"
    "02-technical/tech-stack.md"
    "02-technical/frontend/frontend.md"
    "02-technical/api-documentation/api-documentation.md"
    "02-technical/adaptive-ui/adaptive-ui.md"
    "02-technical/ci-cd/ci-cd.md"
    "02-technical/containerization/containerization.md"
    "02-technical/deployment.md"
    "03-user-guide/index.md"
    "03-user-guide/features.md"
    "03-user-guide/faq.md"
    "04-retrospective/index.md"
    "appendices/glossary.md"
    "appendices/api-reference.md"
    "appendices/db-schema.md"
)

echo "Combining files..."
> "$COMBINED_MD"

FIRST=true
for file in "${FILES[@]}"; do
    if [ -f "$ROOT_DIR/$file" ]; then
        echo "Processing $file..."
        
        if [ "$FIRST" = true ]; then
            FIRST=false
        else
            # Add a page break before subsequent files
            echo -e "\n\n<div style=\"page-break-before: always;\"></div>\n\n" >> "$COMBINED_MD"
        fi
        
        # Read file and replace asset paths
        sed -E 's|(\.\./)+assets/|assets/|g' "$ROOT_DIR/$file" >> "$COMBINED_MD"
    else
        echo "Warning: File $file not found!"
    fi
done

# Specific fix for CI/CD diagram if it points to .mermaid
sed -i 's/ci-cd-pipeline.mermaid/ci-cd.png/g' "$COMBINED_MD"

# Specific fix for DB schema if it's a mermaid block
sed -i '/## Entity Relationship Diagram/a \![Database Schema](assets/diagrams/db-schema.png)' "$COMBINED_MD"

echo "Generating HTML with pandoc..."

# Create a small header file for mermaid
CAT_MERMAID="$ROOT_DIR/mermaid_header.html"
cat > "$CAT_MERMAID" <<EOF
<script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
<script>
    mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'loose',
    });
</script>
<style>
    .mermaid {
        display: flex;
        justify-content: center;
        margin: 20px 0;
    }
</style>
EOF

nix-shell -p pandoc --run "pandoc \"$COMBINED_MD\" -s -o \"$TEMP_HTML\" --toc --toc-depth=2 -H \"$CAT_MERMAID\" --metadata title=\"Automaspec - Technical Documentation\""

echo "Converting HTML to PDF with Chrome..."
# Give it more time and ensure it renders
google-chrome-stable --headless --disable-gpu --run-all-compositor-stages-before-draw --virtual-time-budget=20000 --print-to-pdf="$OUTPUT_PDF" "$TEMP_HTML"

# Cleanup
rm "$COMBINED_MD" "$TEMP_HTML" "$CAT_MERMAID"

echo "Done! Generated $OUTPUT_PDF"
