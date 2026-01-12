# TODO

## 1. Bugs

- [ ] Split signin / signup flow
- [ ] e2e tests only successful in second run in CI

---

## 2. Security — Cross-org Authorization

### 2.1 Fix missing org checks in `orpc/routes/tests.ts`

- [ ] `upsertTest` — add `context.organizationId` check
- [ ] `deleteTest` — add org check before deletion

### 2.2 Audit (verify org isolation)

- [ ] `upsertTestRequirement` — verify specId belongs to user's org
- [ ] `replaceTestRequirementsForSpec` — verify all requirement IDs belong to same org
- [ ] `upsertTestSpec` — verify folderId belongs to user's org
- [ ] `upsertTestFolder` — verify parentFolderId belongs to user's org

### 2.3 Add tests

- [ ] `__tests__/orpc/routes/` — cross-org test deletion blocked
- [ ] `__tests__/orpc/routes/` — cross-org test upsert blocked
- [ ] `__tests__/orpc/routes/` — cross-org requirement manipulation blocked
- [ ] `__tests__/orpc/routes/` — cross-org spec/folder operations blocked
- [ ] `e2e/` — multi-org scenario test

---

## 3. Onboarding — Import from Vitest JSON

### 3.1 Model

```
testResults[].name (file)      → Spec (normalized name)
assertionResults[].title (it)  → Requirement + Test (linked)
```

### 3.2 User Journey

1. Registration → Create organization
2. Dashboard → "Import tests" button
3. User runs: `pnpm vitest --reporter=json --outputFile=test-results.json`
4. User uploads JSON
5. Preview: folder tree with Specs and Requirements (show only Reqs have linked Tests)
6. Confirm → create all (each Requirement auto-linked to its Test)

### 3.3 Implementation Tasks

**Backend:**

- [x] Create `importFromJson` endpoint in `orpc/routes/tests.ts`
- [x] Filename normalization function in `lib/utils.ts`
  - `user-service.test.tsx` → "User Service"
  - Remove: `.test.ts`, `.spec.ts`, `.tsx`, `-`, `_`
  - Convert to Title Case
- [x] Create Folder structure from file paths (e.g., `__tests__/lib/utils/` → "Lib" → "Utils" nested folders)
- [x] Create Spec per unique file, nested in correct folder
- [x] Create Requirement per `assertionResults[].title`
- [x] Create Test, link to Requirement, status from JSON
- [x] Verify `syncReport` only UPDATES status, never CREATES (import creates, sync updates)
- [x] Unit tests for import feature

**Frontend:**

- [x] UI: Upload JSON component in `app/dashboard/components/import-tests-dialog.tsx`
- [x] UI: Import button in header
- [x] UI: Preview parsed results (file count, spec count, requirement count, test count)
- [x] UI: Confirm & import button with success toast

**Future enhancements:**

- [ ] UI: Show command to copy: `pnpm vitest --reporter=json --outputFile=test-results.json`
- [ ] UI: Preview tree (folders → specs → requirements with test status) before import

### 3.4 JSON Structure (what we parse)

```json
{
  "testResults": [{
    "name": "__tests__/lib/utils.test.ts",
    "assertionResults": [
      { "title": "merges classes", "status": "passed" },
      { "title": "handles undefined", "status": "failed" }
    ]
  }]
}
```

### 3.5 Mapping

| JSON field | DB entity | Example |
|------------|-----------|---------|
| `testResults[].name` | `testSpec.name` | `utils.test.ts` → "Utils" |
| `assertionResults[].title` | `testRequirement.name` | "merges classes" |
| `assertionResults[].status` | `test.status` | "passed" / "failed" |

---

## 4. Onboarding — From Scratch

> For now: placeholder UI, no implementation

- [ ] Show "Coming soon" placeholder in dashboard
- [ ] Mock wizard UI (non-functional)
