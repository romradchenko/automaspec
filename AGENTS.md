# Automaspec — Agent Rules

Scope: Entire repository

These rules guide coding changes and reviews in this repo. They consolidate our `.cursor/rules/*` and a few project‑wide conventions so agents consistently follow them.

## Core Code Style

- Imports at top, static only
    - Use static imports at the top of files.
    - Dynamic `import()` is forbidden.

- No classes
    - Do not use `class`. Prefer pure functions and plain objects.

- No `any`
    - Never use the `any` type. Keep types precise.

- No inline types beyond trivial
    - Define shared or non‑trivial types in `lib/types.ts`. Avoid inline types > ~20 chars.

- Constants live in `lib/constants.ts`
    - No inline constants in components/utils. Use named exports, UPPER_SNAKE_CASE or grouped objects.

- Avoid `.map` for general flow
    - Prefer clearer constructs (plain loops, `for..of`, `Set`, `Object` utilities) for readability.

- No code comments
    - Do not leave comments in code. Keep code and names self‑explanatory.

- Tailwind
    - Prefer `size-*` utility over separate `w-*/h-*` pairs where applicable.

## Data + DB

- Timestamps
    - Do not set `created_at`/`updated_at` in code; DB handles them.

- Query hygiene
    - Never perform DB queries inside loops.

- Access pattern
    - Prefer accessing the DB through oRPC context/middleware rather than directly from components.

## Project Operations

- Package manager
    - Use `pnpm`. Before writing scripts, check existing ones in `package.json`.

- Dev server
    - Never start a dev server if one is already running.

- Hooks + formatting
    - Pre‑commit runs Prettier and Oxlint; write code that passes both without needing exceptions.

## Testing

- Use Vitest and React Testing Library patterns for unit/component tests.
- Integration tests are optional and require `NEXT_PUBLIC_DATABASE_URL`.

## References

- Detailed rule files live in `.cursor/rules/` and are considered authoritative. If a rule here conflicts with a more specific `.cursor/rules/*`, the `.cursor` rule wins.

# Simple and short commit messages

Commit messages should be short and clear
