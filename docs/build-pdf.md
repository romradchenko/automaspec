## NixOS
nix-shell -p pandoc mermaid-filter texliveSmall
pandoc -F mermaid-filter -o docs/BA-Requirements.pdf docs/BA-Requirements.md
cd docs && pandoc --pdf-engine=xelatex -o adaptive-ui-documentation.pdf adaptive-ui-documentation.md

## macOS
pandoc -F mermaid-filter -o docs/BA-Requirements.pdf docs/BA-Requirements.md
cd docs && pandoc --pdf-engine=xelatex -o adaptive-ui-documentation.pdf adaptive-ui-documentation.md

## Windows
cd docs
pandoc --pdf-engine=xelatex --variable=geometry:margin=1cm -o adaptive-ui-documentation.pdf adaptive-ui-documentation.md
pandoc --pdf-engine=xelatex -V lang=en-US -V mainfont="Times New Roman" -V monofont="Consolas" --variable=geometry:margin=1cm -o frontend-report.pdf frontend-report.md
