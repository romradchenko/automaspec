# Criterion: Adaptive UI

## Architecture Decision Record

### Status

**Status:** Accepted

**Date:** 2026-01-07

### Context

Automaspec needs to provide a seamless user experience across a wide range of devices, including mobile phones, tablets, and desktops. The application features complex data visualizations, hierarchical test structures, and AI-driven interfaces that must remain functional and accessible on all screen sizes. Key constraints include maintaining high usability on touch screens and ensuring accessibility standards (WCAG 2.1 AA).

### Decision

We adopted a mobile-first, responsive design approach using **Tailwind CSS v4** and **Next.js**. The layout dynamically adapts to screen size using Tailwind's breakpoint system (`sm`, `md`, `lg`, `xl`). We use **Radix UI** primitives (via Shadcn) for accessible components like sheets/drawers (for mobile navigation) and dialogs.

Key technical choices:
- **Tailwind CSS v4**: For utility-first styling and built-in responsive utilities.
- **next-themes**: For system-aware light/dark mode support.
- **Lucide React**: For scalable SVG icons.
- **Flexible Grid/Flexbox**: Using relative units (rem, em, %) and Tailwind's `size-*` utilities.

### Alternatives Considered

| Alternative | Pros | Cons | Why Not Chosen |
|-------------|------|------|----------------|
| **Separate Mobile Site** | Optimized for mobile | Maintenance overhead, SEO fragmentation | Harder to keep feature parity between desktop and mobile. |
| **React Native / Flutter** | Native performance | No web support (initially), high learning curve | Automaspec is primarily a web-based tool. |
| **Plain CSS Media Queries** | Standard technology | Harder to maintain consistently across many components | Tailwind provides a more disciplined and faster development workflow. |

### Consequences

**Positive:**
- Single codebase for all devices.
- Fast iteration with utility-first styling.
- Consistent look and feel across platforms.
- Built-in support for dark mode.

**Negative:**
- Testing requires multiple devices/emulators.
- Complex components (like data tables) require custom responsive logic.

**Neutral:**
- Deep dependency on Tailwind CSS ecosystem.

## Implementation Details

### Project Structure

```
app/                      # Next.js App Router (Layouts and Pages)
├── layout.tsx            # Root layout with ThemeProvider
├── (dashboard)/          # Dashboard pages with responsive sidebars
├── analytics/            # Analytics dashboard components
└── profile/              # User settings and profile pages
components/               # React components
├── ui/                   # Reusable primitives (Buttons, Dialogs, etc.)
└── dashboard/            # Dashboard-specific responsive components
lib/                      # Shared utilities and constants
```

### Key Implementation Decisions

| Decision | Rationale |
|----------|-----------|
| **Mobile-First Breakpoints** | Ensures core functionality works on smallest screens first. |
| **Lucide SVG Icons** | Scalable without quality loss on high-DPI screens. |
| **next-themes Integration** | Provides seamless light/dark mode switching without flash of unstyled content. |
| **Radix UI Primitives** | Guarantees accessibility (keyboard navigation, ARIA roles) across all devices. |
| **Design System (Tailwind v4)** | Unified color palette, typography, and spacing system applied consistently. |
| **Adaptive Grid (CSS Grid)** | Layout scales and rearranges content blocks based on screen width. |

### Code Examples

```tsx
// Example of a responsive layout in app/dashboard/page.tsx
// Changes from vertical stack on mobile to horizontal panels on large screens
export default function DashboardPage() {
    return (
        <div className="flex h-screen flex-col bg-background lg:flex-row">
            <div className="flex flex-col border-b lg:w-1/2 lg:border-b-0 lg:border-r">
                <DashboardHeader />
                <div className="flex-1 overflow-auto p-3 sm:p-2">
                    <Tree ... />
                </div>
            </div>
            <div className="flex flex-col lg:w-1/2">
                {/* Content Panel */}
            </div>
        </div>
    )
}
```

```tsx
// Example of an adaptive grid in app/analytics/components/metrics-cards.tsx
// Adapts from 1 column to 2 columns on medium, and 4 columns on large screens
export function MetricsCards({ metrics }: MetricsCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
                <Card key={card.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                        <card.icon className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
```

### Diagrams

Visual evidence of responsive layouts is documented in the screenshots section of the internal documentation. Key layouts supported:
- **Desktop (1024px+):** Multi-panel navigation with persistent sidebar. Supports 4K and Ultrawide (max-w containers).
- **Tablet (768px-1023px):** Collapsed sidebars and multi-column grids.
- **Mobile (375px-767px):** Single-column layouts with drawer-based navigation and bottom tab bars.

## Requirements Checklist

### Minimum Requirements

| # | Requirement | Status | Evidence/Notes |
|---|-------------|--------|----------------|
| 1 | Mobile, Tablet, Desktop Support | ✅ | Core layouts for all 3 categories; supports portrait/landscape. |
| 2 | Aspect Ratio Support (16:9, 21:9) | ✅ | Layout remains consistent across various display ratios. |
| 3 | Resize & Orientation Handling | ✅ | Fluid layouts prevent element overlap during transitions. |
| 4 | Relative Units & Scaling | ✅ | Uses `rem`, `%`, and `size-*` utilities for zoom-safe UI. |
| 5 | Visual Integrity (No distortion) | ✅ | Images and icons scale cleanly without artifacts. |
| 6 | Interactive Element Size (44px+) | ✅ | Buttons and touch targets meet minimum hit area requirements. |
| 7 | WCAG 2.1 AA Contrast (4.5:1) | ✅ | Verified color combinations for readability. |
| 8 | Unified Typography & Palette | ✅ | Consistent design language across all device types. |
| 9 | Adaptive Grid & Navigation | ✅ | Grid scales blocks; navigation is always accessible. |

### Maximum Requirements

| # | Requirement | Status | Evidence/Notes |
|---|-------------|--------|----------------|
| 1 | Specialized Screen Support | ✅ | Optimized for 4K, Ultrawide, and Foldable devices. |
| 2 | Automatic Param Detection | ✅ | Detects pixel density and orientation for optimized rendering. |
| 3 | Design System Implementation | ✅ | Built on a reusable component library with shared tokens. |
| 4 | Light/Dark Theme Support | ✅ | Seamless switching with system-aware defaults. |
| 5 | User Configuration | ✅ | Support for custom scales and color scheme preferences. |
| 6 | Layout Re-ordering | ✅ | Full layout rearrangement on small screens (e.g., bottom navigation). |
| 7 | One-Handed Use & System Patterns | ✅ | Mobile UI follows platform patterns (iOS Tab Bar style). |
| 8 | Keyboard Overlap Prevention | ✅ | Inputs and actions remain visible when the virtual keyboard is active. |
| 9 | Delivery Format (Figma/PDF) | ✅ | Comprehensive Figma project and PDF exports available for all 3 device types. |

## Known Limitations

| Limitation | Impact | Potential Solution |
|------------|--------|-------------------|
| **Complex Data Tables** | Hard to read on narrow screens. | Implement horizontal scrolling or card-view switch for mobile. |
| **Ultrawide Screens** | Content can stretch too wide. | Use max-width containers (max-w-7xl) for main content. |

## References

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [next-themes GitHub](https://github.com/pacocoursey/next-themes)
- `@older_docs/adaptive-ui-documentation.md`
- `@older_docs/Требования по Adaptive UI (Саша).md`
