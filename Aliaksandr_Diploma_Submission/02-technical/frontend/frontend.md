# Criterion: Front-End Architecture & Development

## Architecture Decision Record

### Status

**Status:** Accepted

**Date:** 2026-01-06

### Context

The Automaspec project requires a modern, scalable, and responsive front-end architecture to manage complex test specifications, requirements, and hierarchical data. Key constraints include the need for a Single Page Application (SPA) experience, tight integration with a type-safe API, robust state management, and support for multi-tenant organizations. The UI must be adaptive (desktop and mobile) and provide a seamless UX for data-intensive tasks like spec management and analytics.

### Decision

We have chosen **Next.js 16 (App Router)** with **React 19** and **TypeScript** as the foundation. This stack provides a powerful framework for building SPAs with server-side optimization where needed.

Key architectural decisions include:
1.  **Component-Based UI:** Using **Tailwind CSS v4** for styling and **Radix UI** primitives for accessible, reusable components.
2.  **State Management:**
    *   **Server State:** Managed by **TanStack Query** to handle caching, synchronization, and optimistic updates.
    *   **Local UI State:** Managed via React hooks (`useState`, `useMemo`, `useRef`).
    *   **Auth/Organization State:** Integrated using **Better Auth** client hooks.
3.  **API Integration:** Utilizing **oRPC** for a type-safe, end-to-end communication layer. We use `safeClient` for direct calls and `orpc` (TanStack Query integration) for reactive data fetching.
4.  **Routing:** Leveraging Next.js App Router for hierarchical routing, including organization-specific flows and protected routes.
5.  **Form Management:** Using **TanStack Form** with **Zod** validation for robust, type-safe form handling.

### Alternatives Considered

| Alternative | Pros | Cons | Why Not Chosen |
|-------------|------|------|----------------|
| **Vite + React** | Faster build times, pure SPA | Lacks built-in SSR/ISR, more boilerplate for routing | Next.js provides a more comprehensive framework for our needs (Auth, API routes). |
| **Angular** | Opinionated, built-in features | Steeper learning curve, more verbose | React's ecosystem and flexibility better suit our rapid development and AI integration. |
| **Redux for State** | Predictable state container | High boilerplate, complex for server state | TanStack Query + local state is more efficient for our data patterns. |

### Consequences

**Positive:**
- **End-to-End Type Safety:** oRPC ensures frontend and backend types are always in sync.
- **Enhanced UX:** SPA-like navigation with client-side transitions and optimistic updates.
- **Scalability:** Component-based architecture allows for easy extension and maintenance.
- **Responsive Design:** Tailwind CSS v4 enables rapid building of adaptive layouts.

**Negative:**
- **Next.js Complexity:** Requires understanding of Server Components vs. Client Components.
- **Dependency Management:** Heavy reliance on TanStack ecosystem.

**Neutral:**
- **Turbopack Usage:** Faster development builds but still in evolution.

## Implementation Details

### Project Structure

```
app/
├── (organizations)/    # Organization selection and creation flows
├── ai/                 # AI Assistant page
├── analytics/          # Analytics dashboard with Recharts
├── dashboard/          # Main workspace for specs and folders
├── login/              # Authentication (Sign in / Sign up)
├── profile/            # User settings and API keys
├── layout.tsx          # Root layout with providers
└── providers.tsx       # Context providers (Query, Theme, Auth)
components/
├── ui/                 # Reusable Radix UI-based primitives (shadcn-like)
├── loader.tsx          # Shared loading component
└── theme-provider.tsx  # Dark/Light mode management
lib/
├── orpc/               # oRPC client configuration
├── query/              # TanStack Query client and utilities
├── shared/             # Shared auth and form logic
└── types.ts            # Shared TypeScript definitions
```

### Key Implementation Decisions

| Decision | Rationale |
|----------|-----------|
| **oRPC + TanStack Query** | Provides seamless, type-safe integration between the client and the OpenAPI-compliant backend. |
| **App Router Navigation** | Enables clean, hierarchical URLs (e.g., `/dashboard`, `/analytics`) with efficient client-side transitions. |
| **Better Auth Client** | Handles session management and organization switching natively with minimal boilerplate. |
| **Tailwind CSS v4** | Used for all styling, leveraging modern CSS features and the `size-*` utility for consistent sizing. |
| **Global Error Handling** | Implemented via `global-error.tsx` and React Error Boundaries for a resilient UI. |

### Code Examples

**oRPC Client Definition (`lib/orpc/orpc.ts`):**
```typescript
import { createORPCClient, createSafeClient } from '@orpc/client'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { contract } from '@/orpc/contracts'

const link = new OpenAPILink(contract, {
    url: () => `${window.location.origin}/rpc`,
    fetch: async (request, init) =>
        globalThis.fetch(request, { ...init, credentials: 'include' }),
})

const client = createORPCClient(link)
export const safeClient = createSafeClient(client)
export const orpc = createTanstackQueryUtils(client)
```

**Analytics Data Fetching (`app/analytics/page.tsx`):**
```typescript
const { data, isLoading } = useQuery(orpc.analytics.getMetrics.queryOptions({ 
    input: { period } 
}))
```

## Requirements Checklist

| # | Requirement | Status | Evidence/Notes |
|---|-------------|--------|----------------|
| 1 | Single Page Application (SPA) | ✅ | Implemented using Next.js App Router with client-side navigation. |
| 2 | Modern Framework (React/Angular/Vue) | ✅ | Built with React 19. |
| 3 | Component-Based Architecture | ✅ | Divided into Pages, Feature Components, and UI Primitives. |
| 4 | Routing (3-4+ routes) | ✅ | Routes: `/dashboard`, `/analytics`, `/ai`, `/profile`, `/login`. |
| 5 | State Management (Local + Global) | ✅ | Local: `useState`; Global/Server: TanStack Query + Auth Context. |
| 6 | API Integration (Type-safe) | ✅ | oRPC ensures TypeScript types match Backend contracts. |
| 7 | Form Validation | ✅ | TanStack Form + Zod used in Login and Organization flows. |
| 8 | Adaptive UI (Multi-Device) | ✅ | Responsive layouts built with Tailwind CSS v4; follows comprehensive adaptive UI criteria. |
| 9 | Error Handling (UI/UX) | ✅ | Global error handler, toast notifications (`sonner`), and loading states. |
| 10 | Testing (Unit + Integration/E2E) | ✅ | Vitest for components; Playwright for E2E user flows. |

**Legend:**
- ✅ Fully implemented
- ⚠️ Partially implemented
- ❌ Not implemented

## Known Limitations

| Limitation | Impact | Potential Solution |
|------------|--------|-------------------|
| **Client-Heavy Dashboard** | Initial load of large spec trees can be optimized. | Implement virtualization for the tree component or further lazy loading. |
| **Limited Offline Support** | App requires an active connection for most features. | Integrate PWA features and offline caching for TanStack Query. |

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [oRPC Documentation](https://orpc.sh)
- [Better Auth Docs](https://www.better-auth.com)
- [Tailwind CSS v4](https://tailwindcss.com/docs/v4-beta)
