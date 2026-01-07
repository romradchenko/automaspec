Adaptive UI Documentation
Overview
Automaspec implements a responsive UI that works across mobile, tablet, and desktop layouts while keeping core flows (auth, dashboard,
analytics, AI) usable on all screen sizes.

Device Support
• Mobile (≈ 375px–767px): single-column layouts, touch-friendly controls
• Tablet (≈ 768px–1023px): increased density, two-column layouts where appropriate
• Desktop (1024px+): full layouts with side navigation and multi-panel pages

Visual and Accessibility Criteria
• Typography scales via responsive Tailwind utilities and consistent sizing tokens
• Icons are SVG-based (Lucide) and scale without distortion
• Buttons and interactive controls maintain touch-friendly sizing on mobile
• Light/dark theme support via next‐themes

Layout and Components
• Responsive layout composition via Tailwind CSS v4 utilities (sm:, md:, lg:)
• Sheets/drawers and dialogs are used for mobile-friendly navigation and actions
• Reusable UI primitives live in components/ui/*

Screenshots
Login Page

Figure 1: Login Desktop
Desktop (1920×1080)
Tablet (768×1024)

Figure 2: Login Tablet

Mobile (375×667)
Dashboard Page
Desktop (1920×1080)
Tablet (768×1024)
Mobile (375×667)

Technical Notes
• Framework: Next.js (App Router) + React 19 + TypeScript
• Styling: Tailwind CSS v4
• Theme: next‐themes + CSS variables

Conclusion
The UI adapts to common device breakpoints and maintains functional parity across screen sizes for key flows.

Figure 3: Login Mobile

Figure 4: Dashboard Desktop

Figure 5: Dashboard Tablet

Figure 6: Dashboard Mobile

