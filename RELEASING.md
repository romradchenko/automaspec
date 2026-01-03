# Releasing Automaspec

This document describes how to cut releases, how to write release notes, and how the changelog is maintained.

## Source Of Truth

- Version: `package.json#version`
- Changelog: `CHANGELOG.md`
- Tags: `vX.Y.Z`

## Release Notes (What To Write)

Release notes should be readable by operators and contributors. Prefer short, actionable bullets and explicit upgrade instructions.

### Release Notes Template

Copy/paste for each release:

- Highlights:
  - …
- Breaking Changes:
  - …
- Deprecations:
  - …
- Features:
  - …
- Fixes:
  - …
- Performance:
  - …
- Docs:
  - …
- Security:
  - …
- Upgrade Notes:
  - …

### Writing Guidelines

- Prefer “what changed” + “who is impacted” + “what to do”.
- If an env var changes, include the exact key name(s).
- If a migration is required, say so and reference the script (`pnpm dbm`, `pnpm dbup`).
- If behavior changes, include any new defaults.

## Changelog Maintenance

`CHANGELOG.md` is updated continuously.

- All user-visible changes land under `[Unreleased]` first.
- At release time, `[Unreleased]` is moved into a new version section and a fresh `[Unreleased]` is created.
- If a change is not user-visible (refactors, tests), it can be omitted unless it impacts contributors or operations.

## Cut A Release (Checklist)

1. Decide the version bump using `VERSIONING.md`.
2. Update `package.json#version`.
3. If OpenAPI `info.version` is exposed to consumers, align it with the release version.
4. Update `CHANGELOG.md`:
   - Move entries from `[Unreleased]` into the new version section.
   - Ensure breaking changes and upgrade notes are explicit.
5. Validate locally:
   - `pnpm test`
   - `pnpm typecheck`
   - `pnpm lint`
   - `pnpm build`
6. Create a git tag `vX.Y.Z` and push it.
7. Create a GitHub release using the release notes template and the relevant changelog entries.

## Pre-Releases (Optional)

If you need a release candidate:

- Use a SemVer pre-release label in the git tag and package version, for example: `1.2.0-rc.1`.
- Keep release notes updated as you iterate.

