Adaptive UI Documentation

## Overview

AutomaSpec provides a responsive UI that keeps the core product flows usable and visually consistent across mobile, tablet, and desktop.

## Device Support

- Mobile (~375px-767px): single-column layouts and touch-friendly controls
- Tablet (~768px-1023px): increased density, two-column layouts where appropriate
- Desktop (1024px+): full layouts with side navigation and multi-panel pages

Tailwind breakpoints used throughout the UI:

- 640px (sm), 768px (md), 1024px (lg), 1280px (xl), 1536px (2xl)

## Visual and Accessibility Criteria

- Typography scales via relative sizing and responsive utilities
- Icons are SVG-based (Lucide) and scale without distortion
- Interactive controls keep mobile-friendly hit targets
- Light/dark theme support via `next-themes` with CSS variables

## Layout and Components

- Layout composition via Tailwind CSS v4 responsive utilities (`sm:`, `md:`, `lg:`)
- Sheet/drawer patterns for mobile navigation and actions
- Reusable UI primitives live in `components/ui`

## Screenshots (Production)

### Home

#### Desktop

![Home (Desktop)](../Roman_Diploma_Submission/assets/screenshots/prod-home-desktop.png)

#### Tablet

![Home (Tablet)](../Roman_Diploma_Submission/assets/screenshots/prod-home-tablet.png)

#### Mobile

![Home (Mobile)](../Roman_Diploma_Submission/assets/screenshots/prod-home-mobile.png)

### Login

#### Desktop

![Login (Desktop)](../Roman_Diploma_Submission/assets/screenshots/prod-login-desktop.png)

#### Tablet

![Login (Tablet)](../Roman_Diploma_Submission/assets/screenshots/prod-login-tablet.png)

#### Mobile

![Login (Mobile)](../Roman_Diploma_Submission/assets/screenshots/prod-login-mobile.png)

### Choose Organization

#### Desktop

![Choose Organization (Desktop)](../Roman_Diploma_Submission/assets/screenshots/prod-choose-organization-desktop.png)

#### Tablet

![Choose Organization (Tablet)](../Roman_Diploma_Submission/assets/screenshots/prod-choose-organization-tablet.png)

#### Mobile

![Choose Organization (Mobile)](../Roman_Diploma_Submission/assets/screenshots/prod-choose-organization-mobile.png)

### Dashboard

#### Desktop

![Dashboard (Desktop)](../Roman_Diploma_Submission/assets/screenshots/prod-dashboard-desktop.png)

#### Tablet

![Dashboard (Tablet)](../Roman_Diploma_Submission/assets/screenshots/prod-dashboard-tablet.png)

#### Mobile

![Dashboard (Mobile)](../Roman_Diploma_Submission/assets/screenshots/prod-dashboard-mobile.png)

### Folder View

#### Desktop

![Folder View (Desktop)](../Roman_Diploma_Submission/assets/screenshots/prod-folder-view-desktop.png)

#### Tablet

![Folder View (Tablet)](../Roman_Diploma_Submission/assets/screenshots/prod-folder-view-tablet.png)

#### Mobile

![Folder View (Mobile)](../Roman_Diploma_Submission/assets/screenshots/prod-folder-view-mobile.png)

### Analytics

#### Desktop

![Analytics (Desktop)](../Roman_Diploma_Submission/assets/screenshots/prod-analytics-desktop.png)

#### Tablet

![Analytics (Tablet)](../Roman_Diploma_Submission/assets/screenshots/prod-analytics-tablet.png)

#### Mobile

![Analytics (Mobile)](../Roman_Diploma_Submission/assets/screenshots/prod-analytics-mobile.png)

### RPC Docs

#### Desktop

![RPC Docs (Desktop)](../Roman_Diploma_Submission/assets/screenshots/prod-rpc-docs-desktop.png)

#### Tablet

![RPC Docs (Tablet)](../Roman_Diploma_Submission/assets/screenshots/prod-rpc-docs-tablet.png)

#### Mobile

![RPC Docs (Mobile)](../Roman_Diploma_Submission/assets/screenshots/prod-rpc-docs-mobile.png)

## Technical Notes

- Framework: Next.js 16 (App Router) + React 19 + TypeScript
- Styling: Tailwind CSS v4
- Theme: `next-themes` + CSS variables
- Icons: `lucide-react`

## Conclusion

The UI adapts to common device breakpoints and maintains functional parity across screen sizes for key product flows.