# Automaspec — Agent Rules

Scope: Entire repository

These rules guide coding changes and reviews in this repo.

## Core Code Style

### Imports at top, static only

- Use static imports at the top of files.
- Dynamic `import()` is forbidden.

Use static imports at the top:

```typescript
import { startTestAnalysisService } from '@/lib/test-analysis-service'
```

Never use dynamic imports:

```typescript
// FORBIDDEN
import('@/lib/test-analysis-service').then(...)
await import('@/lib/test-analysis-service')
```

### No `require()`

- Never use `require()` in code, always use `import` instead.

### No classes

- Classes are forbidden. Never write `class` in your code.
- Use functions, objects, or modules instead.

```typescript
// FORBIDDEN
class TestService {
  constructor() {}
  start() {}
}

// FORBIDDEN
function createTestService() {
  return {
    start: () => {},
    stop: () => {}
  }
}

// FORBIDDEN
export const testService = {
  start: () => {},
  stop: () => {}
}

// FORBIDDEN
function useTestService() {
  let isRunning = false
  
  return {
    start: () => { isRunning = true },
    stop: () => { isRunning = false }
  }
}

// ALLOWED - Pure functions
function validateConfig(config) {
  return config && config.organizationId
}

function processData(data) {
  return data.map(item => ({ ...item, processed: true }))
}
```

### No `any`

- Never use the `any` type. Keep types precise.

### No inline types beyond trivial

- Never declare types in code, except files that have types in their name.
- Define shared or non‑trivial types in `lib/types.ts`. Avoid inline types > ~20 chars.

### Constants live in `lib/constants.ts`

- **FORBIDDEN**: Defining constants directly in component files, utility files, or any other location
- **REQUIRED**: All constants must be defined in `lib/constants.ts` and imported where needed
- **REQUIRED**: Use descriptive, UPPER_SNAKE_CASE names for constants
- **REQUIRED**: Folder related constants in objects when appropriate
- **REQUIRED**: Export constants from `lib/constants.ts` using named exports

#### Examples

**✅ ALLOWED - Constants in `lib/constants.ts`:**

```typescript
// lib/constants.ts
export const API_ENDPOINTS = {
  USERS: '/api/users',
  TESTS: '/api/tests',
  REPORTS: '/api/reports'
} as const

export const DEFAULT_TIMEOUT = 5000
export const MAX_RETRY_ATTEMPTS = 3
export const SUPPORTED_FILE_TYPES = ['json', 'csv', 'txt'] as const
```

**✅ ALLOWED - Importing constants:**

```typescript
// components/SomeComponent.tsx
import { API_ENDPOINTS, DEFAULT_TIMEOUT } from '@/lib/constants'

function SomeComponent() {
  const response = await fetch(API_ENDPOINTS.USERS, {
    timeout: DEFAULT_TIMEOUT
  })
}
```

**❌ FORBIDDEN - Constants defined inline:**

```typescript
// components/SomeComponent.tsx
function SomeComponent() {
  const API_URL = '/api/users' // FORBIDDEN
  const TIMEOUT = 5000 // FORBIDDEN
  
  const response = await fetch(API_URL, { timeout: TIMEOUT })
}
```

**❌ FORBIDDEN - Constants in utility files:**

```typescript
// lib/utils.ts
export const CONFIG_VALUES = { // FORBIDDEN
  MAX_SIZE: 100,
  MIN_SIZE: 1
}

export function validateSize(size: number) {
  return size >= CONFIG_VALUES.MIN_SIZE && size <= CONFIG_VALUES.MAX_SIZE
}
```

#### What constitutes a constant

- String literals used in multiple places
- Numeric values (timeouts, limits, sizes)
- Configuration objects
- Enum-like objects
- Array literals with fixed values
- Any value that doesn't change during runtime

#### Exceptions

- Only local variables that are truly component-specific and used only once may remain inline
- Magic numbers in mathematical calculations (e.g., `Math.PI * 2`) are acceptable
- Template literals for dynamic content are acceptable

#### Enforcement

- Always move constants to `lib/constants.ts` before implementing features
- When refactoring, identify and move any inline constants
- Use TypeScript's `as const` assertion for better type safety
- Folder related constants in objects for better organization

### Avoid `.map` for general flow

- Avoid using `map` in code, prefer using more easy readable things like: `Obj`, `Array`, `Set`
- Prefer clearer constructs (plain loops, `for..of`, `Set`, `Object` utilities) for readability.

### No code comments

- Never leave comments in code. Keep code and names self‑explanatory.

### Tailwind

- IMPORTANT: Instead of `w-4 h-4` and similar styles use `size-4`
- Prefer `size-*` utility over separate `w-*/h-*` pairs where applicable.

## Data + DB

### Timestamps

- Do not add `created_at` and `updated_at` values on backend, they are already handled at database-level.
- Do not set `created_at`/`updated_at` in code; DB handles them.

### Query hygiene

- Never do DB queries inside of the loop (for/while or any other loop).
- Never perform DB queries inside loops.

### Access pattern

- Prefer accessing the DB through oRPC context/middleware rather than directly from components.

## Project Operations

### Package manager

- Use `pnpm`. Before running any scripts always look if they are already implemented in `package.json`.

### Dev server

- NEVER run dev server start if it is already running.
- Never start a dev server if one is already running.

### Hooks + formatting

- Pre‑commit runs Prettier and Oxlint; write code that passes both without needing exceptions.

## Testing

- Use Vitest and React Testing Library patterns for unit/component tests.
- Integration tests are optional and require `NEXT_PUBLIC_DATABASE_URL`.

## Commit Messages

- Commit messages should be short and clear.
