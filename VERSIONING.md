# Versioning Policy

This document defines how Automaspec versions are assigned, what “breaking” means for this repo, and how different parts of the system relate to releases.

Automaspec is a product, not a library, but it still has “public surfaces” that downstream consumers rely on (API contracts, database schema, configuration, and operational behavior). Versioning is used to communicate risk and upgrade effort.

## Canonical Version

The canonical release version is `package.json#version`.

- Git tags use the form `vX.Y.Z` (for example: `v1.4.2`).
- Docker images may be tagged with the same version (for example: `automaspec-web:v1.4.2`) in addition to environment-specific tags.

## Semantic Versioning (SemVer)

We follow SemVer with a practical definition of the “public API” for this repository.

Given `MAJOR.MINOR.PATCH`:

- `MAJOR`: Breaking change to any defined public surface.
- `MINOR`: Backwards-compatible feature addition.
- `PATCH`: Backwards-compatible bug fix or internal change with no expected behavior impact.

## Pre-1.0 Rules

While `MAJOR` is `0` (for example: `0.1.0`), we treat `MINOR` as the breaking-change signal:

- Breaking changes: bump `0.MINOR.0`
- Backwards-compatible features: bump `0.MINOR.PATCH` or `0.(MINOR+1).0` (team choice, but be consistent inside a release train)
- Fixes: bump `0.MINOR.PATCH`

When Automaspec is stable enough to commit to long-lived compatibility guarantees, we move to `1.0.0` and use standard SemVer semantics.

## What Counts As “Public Surface”

Changes are evaluated against these surfaces:

### 1) API Contract Surface

Automaspec exposes server endpoints (including oRPC and any HTTP routes) that clients depend on.

Breaking examples:

- Removing or renaming an endpoint.
- Changing required fields, request/response shapes, or error formats.
- Changing auth requirements (for example: endpoint that used to be accessible now requires different scope/role).
- Changing rate limits in a way that breaks existing usage patterns.

Non-breaking examples:

- Adding an optional field to a response.
- Adding a new endpoint.
- Adding new error codes while keeping existing ones stable.

OpenAPI generation should reflect the release version. If the OpenAPI `info.version` is surfaced to consumers, keep it aligned with `package.json#version`.

### 2) Database Schema Surface

Schema and data shape are part of the public surface because they affect migrations, backups, and operational safety.

Breaking examples:

- Removing a column/table used by the application without a migration path.
- Changing column meaning or constraints in ways that cause existing data to become invalid.
- Making previously nullable fields required without defaults/backfill.

Non-breaking examples:

- Adding new tables or nullable columns.
- Adding indexes.
- Adding columns with safe defaults and backfilling as part of migrations.

Drizzle migrations are the source of truth for schema evolution. A release that changes schema must include the required migrations.

### 3) Configuration Surface (Environment Variables)

Environment variables are a contract with operators.

Breaking examples:

- Renaming or removing an env var without supporting both names during a transition period.
- Changing the interpretation of a value (for example: switching from URL to JSON).

Non-breaking examples:

- Adding new optional env vars.
- Adding validation that rejects clearly invalid configs if valid configs keep working.

### 4) Operational Surface

Operational behavior changes can be breaking even if APIs and schema stay the same.

Breaking examples:

- Changing default ports or required runtime permissions.
- Changes that invalidate documented deployment flows (Docker, Vercel, etc.).

Non-breaking examples:

- Performance improvements with identical behavior.
- Additional logs/telemetry that do not require operator changes.

## Deprecation Policy

Deprecations are used to make breaking changes predictable.

When deprecating:

1. Add a `Deprecated` entry in `CHANGELOG.md` describing what will change and how to migrate.
2. Keep the deprecated behavior working for at least one MINOR release (or one `0.MINOR` release while pre-1.0), unless the change is security-critical.
3. When removing, add a `Removed` entry with upgrade notes.

## Breaking Change Checklist

If a change is considered breaking:

- Add an explicit `Breaking Changes` section in the release notes.
- Update `CHANGELOG.md` with `Changed`/`Removed` entries that include migration steps.
- Ensure database migrations are safe and documented.
- Ensure config changes include a transition plan.

## Examples (Decision Guide)

- Adding an optional response field: `MINOR`
- Fixing a bug in an existing endpoint: `PATCH`
- Renaming an endpoint: `MAJOR` (or `0.MINOR` pre-1.0)
- New feature behind a new route/endpoint: `MINOR`
- Removing an env var: `MAJOR` (or `0.MINOR` pre-1.0)

