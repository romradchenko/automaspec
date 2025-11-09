-- Insert test folders (test tables use text timestamps with CURRENT_TIMESTAMP)
INSERT INTO test_folder (id, name, description, parent_folder_id, organization_id, "order", created_at, updated_at) VALUES 
('folder-1', 'Dashboard Tests', 'Tests for dashboard functionality', NULL, 'FBMJEf0o18Bsk8BTD3OXuRhxBigwH6r0', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('folder-2', 'Authentication', 'User authentication and authorization tests', NULL, 'FBMJEf0o18Bsk8BTD3OXuRhxBigwH6r0', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('folder-3', 'Test Management', 'Tests for test CRUD operations', NULL, 'FBMJEf0o18Bsk8BTD3OXuRhxBigwH6r0', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('folder-4', 'API Routes', 'Backend API endpoint tests', NULL, 'FBMJEf0o18Bsk8BTD3OXuRhxBigwH6r0', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('folder-5', 'Organization Management', 'Organization and member management tests', NULL, 'FBMJEf0o18Bsk8BTD3OXuRhxBigwH6r0', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert test specs (test files)
INSERT INTO test_spec (id, name, file_name, description, statuses, number_of_tests, folder_id, organization_id, created_at, updated_at) VALUES 
('spec-1', 'Dashboard Tree View', 'dashboard-tree.spec.ts', 'Tests for test tree navigation and display', '{"passed":2,"failed":1,"pending":0,"skipped":0,"todo":0,"disabled":0,"missing":0,"deactivated":0,"partial":0}', 3, 'folder-1', 'FBMJEf0o18Bsk8BTD3OXuRhxBigwH6r0', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('spec-2', 'Test Details Panel', 'test-details-panel.spec.ts', 'Tests for test details display and editing', '{"passed":2,"failed":0,"pending":1,"skipped":0,"todo":0,"disabled":0,"missing":0,"deactivated":0,"partial":0}', 3, 'folder-1', 'FBMJEf0o18Bsk8BTD3OXuRhxBigwH6r0', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('spec-3', 'User Login', 'user-login.spec.ts', 'Tests for user authentication flow', '{"passed":3,"failed":0,"pending":0,"skipped":0,"todo":0,"disabled":0,"missing":0,"deactivated":0,"partial":0}', 3, 'folder-2', 'FBMJEf0o18Bsk8BTD3OXuRhxBigwH6r0', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('spec-4', 'Session Management', 'session-management.spec.ts', 'Tests for session handling and expiration', '{"passed":1,"failed":1,"pending":1,"skipped":0,"todo":0,"disabled":0,"missing":0,"deactivated":0,"partial":0}', 3, 'folder-2', 'FBMJEf0o18Bsk8BTD3OXuRhxBigwH6r0', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('spec-5', 'Create Test Spec', 'create-test-spec.spec.ts', 'Tests for creating new test specifications', '{"passed":2,"failed":0,"pending":1,"skipped":0,"todo":0,"disabled":0,"missing":0,"deactivated":0,"partial":0}', 3, 'folder-3', 'FBMJEf0o18Bsk8BTD3OXuRhxBigwH6r0', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('spec-6', 'Update Test Status', 'update-test-status.spec.ts', 'Tests for updating test statuses', '{"passed":3,"failed":0,"pending":0,"skipped":0,"todo":0,"disabled":0,"missing":0,"deactivated":0,"partial":0}', 3, 'folder-3', 'FBMJEf0o18Bsk8BTD3OXuRhxBigwH6r0', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('spec-7', 'Test API Endpoints', 'test-api.spec.ts', 'API tests for test management endpoints', '{"passed":2,"failed":1,"pending":1,"skipped":0,"todo":0,"disabled":0,"missing":0,"deactivated":0,"partial":0}', 4, 'folder-4', 'FBMJEf0o18Bsk8BTD3OXuRhxBigwH6r0', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('spec-8', 'Organization API', 'organization-api.spec.ts', 'API tests for organization management', '{"passed":2,"failed":0,"pending":1,"skipped":0,"todo":0,"disabled":0,"missing":0,"deactivated":0,"partial":0}', 3, 'folder-5', 'FBMJEf0o18Bsk8BTD3OXuRhxBigwH6r0', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert test requirements for dashboard-tree.spec.ts
INSERT INTO test_requirement (id, name, description, "order", spec_id, created_at, updated_at) VALUES 
('req-1', 'Should display test folders in tree structure', 'Tree component should render folders hierarchically', 1, 'spec-1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-2', 'Should expand and collapse folders', 'User should be able to toggle folder visibility', 2, 'spec-1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-3', 'Should display test specs within folders', 'Test specs should be visible under their parent folders', 3, 'spec-1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert test requirements for test-details-panel.spec.ts
INSERT INTO test_requirement (id, name, description, "order", spec_id, created_at, updated_at) VALUES 
('req-4', 'Should display test spec details', 'Panel should show test name, description, and status', 1, 'spec-2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-5', 'Should display all test requirements', 'List all requirements associated with the test spec', 2, 'spec-2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-6', 'Should allow editing test details', 'User should be able to update test spec information', 3, 'spec-2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert test requirements for user-login.spec.ts
INSERT INTO test_requirement (id, name, description, "order", spec_id, created_at, updated_at) VALUES 
('req-7', 'Should authenticate with valid credentials', 'User login with correct email and password', 1, 'spec-3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-8', 'Should reject invalid credentials', 'Login should fail with incorrect password', 2, 'spec-3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-9', 'Should redirect to dashboard after login', 'Successful login redirects to /dashboard', 3, 'spec-3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert test requirements for session-management.spec.ts
INSERT INTO test_requirement (id, name, description, "order", spec_id, created_at, updated_at) VALUES 
('req-10', 'Should maintain session across page reloads', 'User session persists after page refresh', 1, 'spec-4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-11', 'Should clear session on logout', 'Logout should remove user session', 2, 'spec-4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-12', 'Should handle expired sessions', 'Redirect to login when session expires', 3, 'spec-4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert test requirements for create-test-spec.spec.ts
INSERT INTO test_requirement (id, name, description, "order", spec_id, created_at, updated_at) VALUES 
('req-13', 'Should create new test spec in folder', 'User can add test spec to selected folder', 1, 'spec-5', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-14', 'Should validate required fields', 'Form should validate name and organization', 2, 'spec-5', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-15', 'Should initialize with default statuses', 'New test spec should have all status counts at 0', 3, 'spec-5', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert test requirements for update-test-status.spec.ts
INSERT INTO test_requirement (id, name, description, "order", spec_id, created_at, updated_at) VALUES 
('req-16', 'Should update test status to passed', 'Mark test as passed and update count', 1, 'spec-6', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-17', 'Should update test status to failed', 'Mark test as failed and update count', 2, 'spec-6', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-18', 'Should reflect status in parent spec', 'Test spec statuses should update when test changes', 3, 'spec-6', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert test requirements for test-api.spec.ts
INSERT INTO test_requirement (id, name, description, "order", spec_id, created_at, updated_at) VALUES 
('req-19', 'Should fetch all tests for organization', 'GET /api/tests returns organization tests', 1, 'spec-7', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-20', 'Should create new test requirement', 'POST /api/test-requirements creates requirement', 2, 'spec-7', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-21', 'Should update test spec details', 'PUT /api/test-specs/:id updates spec', 3, 'spec-7', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-22', 'Should delete test spec and cascade', 'DELETE /api/test-specs/:id removes spec and children', 4, 'spec-7', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert test requirements for organization-api.spec.ts
INSERT INTO test_requirement (id, name, description, "order", spec_id, created_at, updated_at) VALUES 
('req-23', 'Should create new organization', 'POST /api/organizations creates organization', 1, 'spec-8', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-24', 'Should add member to organization', 'POST /api/organizations/:id/members adds member', 2, 'spec-8', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('req-25', 'Should list organization members', 'GET /api/organizations/:id/members returns members', 3, 'spec-8', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert tests (realistic unit tests for the project)
INSERT INTO test (id, status, framework, code, requirement_id, created_at, updated_at) VALUES 
('test-1', 'passed', 'vitest', 'import { render, screen } from "@testing-library/react"
import { Tree } from "@/app/dashboard/tree"

test("should display test folders in tree structure", () => {
  const folders = [{ id: "1", name: "Test Folder", children: [] }]
  render(<Tree folders={folders} />)
  expect(screen.getByText("Test Folder")).toBeInTheDocument()
})', 'req-1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-2', 'passed', 'vitest', 'import { render, screen, fireEvent } from "@testing-library/react"
import { Tree } from "@/app/dashboard/tree"

test("should expand and collapse folders", async () => {
  const folders = [{ id: "1", name: "Folder", children: [{ id: "2", name: "Child" }] }]
  render(<Tree folders={folders} />)
  const toggle = screen.getByRole("button", { name: /toggle/i })
  fireEvent.click(toggle)
  expect(screen.getByText("Child")).toBeVisible()
})', 'req-2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-3', 'failed', 'vitest', 'import { render, screen } from "@testing-library/react"
import { Tree } from "@/app/dashboard/tree"

test("should display test specs within folders", () => {
  const folders = [{ id: "1", name: "Folder", specs: [{ id: "s1", name: "spec.ts" }] }]
  render(<Tree folders={folders} />)
  expect(screen.getByText("spec.ts")).toBeInTheDocument()
  // Fails: specs not rendering correctly
})', 'req-3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-4', 'passed', 'vitest', 'import { render, screen } from "@testing-library/react"
import TestDetailsPanel from "@/app/dashboard/test-details-panel"

test("should display test spec details", () => {
  const spec = { id: "1", name: "Test", description: "Description" }
  render(<TestDetailsPanel spec={spec} />)
  expect(screen.getByText("Test")).toBeInTheDocument()
  expect(screen.getByText("Description")).toBeInTheDocument()
})', 'req-4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-5', 'passed', 'vitest', 'import { render, screen } from "@testing-library/react"
import TestDetailsPanel from "@/app/dashboard/test-details-panel"

test("should display all test requirements", () => {
  const spec = { id: "1", name: "Test", requirements: [{ id: "r1", name: "Req 1" }] }
  render(<TestDetailsPanel spec={spec} />)
  expect(screen.getByText("Req 1")).toBeInTheDocument()
})', 'req-5', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-6', 'pending', 'vitest', 'import { render, screen, fireEvent } from "@testing-library/react"
import TestDetailsPanel from "@/app/dashboard/test-details-panel"

test("should allow editing test details", () => {
  // TODO: Implement edit functionality test
})', 'req-6', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-7', 'passed', 'vitest', 'import { signIn } from "@/lib/shared/better-auth"

test("should authenticate with valid credentials", async () => {
  const result = await signIn.email({ 
    email: "test@example.com", 
    password: "password123" 
  })
  expect(result.user).toBeDefined()
  expect(result.user.email).toBe("test@example.com")
})', 'req-7', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-8', 'passed', 'vitest', 'import { signIn } from "@/lib/shared/better-auth"

test("should reject invalid credentials", async () => {
  await expect(
    signIn.email({ email: "test@example.com", password: "wrong" })
  ).rejects.toThrow("Invalid credentials")
})', 'req-8', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-9', 'passed', 'vitest', 'import { render, screen } from "@testing-library/react"
import { useRouter } from "next/navigation"

test("should redirect to dashboard after login", async () => {
  const { push } = useRouter()
  // After successful login
  expect(push).toHaveBeenCalledWith("/dashboard")
})', 'req-9', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-10', 'passed', 'vitest', 'import { render } from "@testing-library/react"
import { useSession } from "@/lib/shared/better-auth"

test("should maintain session across page reloads", () => {
  const { data: session } = useSession()
  window.location.reload()
  expect(session).toBeDefined()
})', 'req-10', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-11', 'failed', 'vitest', 'import { signOut } from "@/lib/shared/better-auth"

test("should clear session on logout", async () => {
  await signOut()
  const session = await getSession()
  expect(session).toBeNull()
  // Fails: session still exists
})', 'req-11', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-12', 'pending', 'vitest', 'test("should handle expired sessions", () => {
  // TODO: Implement session expiration handling
})', 'req-12', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-13', 'passed', 'vitest', 'import { db } from "@/db"
import { testSpec } from "@/db/schema"

test("should create new test spec in folder", async () => {
  const result = await db.insert(testSpec).values({
    id: "test-1",
    name: "New Test",
    organizationId: "org-1",
    folderId: "folder-1"
  })
  expect(result).toBeDefined()
})', 'req-13', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-14', 'passed', 'vitest', 'import { testSpecInsertSchema } from "@/lib/types"

test("should validate required fields", () => {
  const invalid = { name: "", organizationId: "" }
  expect(() => testSpecInsertSchema.parse(invalid)).toThrow()
})', 'req-14', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-15', 'pending', 'vitest', 'test("should initialize with default statuses", () => {
  // TODO: Verify default status initialization
})', 'req-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-16', 'passed', 'vitest', 'import { db } from "@/db"
import { test } from "@/db/schema"
import { TEST_STATUSES } from "@/lib/constants"

test("should update test status to passed", async () => {
  await db.update(test)
    .set({ status: TEST_STATUSES.passed })
    .where(eq(test.id, "test-1"))
  const updated = await db.query.test.findFirst({ where: eq(test.id, "test-1") })
  expect(updated.status).toBe("passed")
})', 'req-16', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-17', 'passed', 'vitest', 'import { db } from "@/db"
import { test } from "@/db/schema"
import { TEST_STATUSES } from "@/lib/constants"

test("should update test status to failed", async () => {
  await db.update(test)
    .set({ status: TEST_STATUSES.failed })
    .where(eq(test.id, "test-1"))
  const updated = await db.query.test.findFirst({ where: eq(test.id, "test-1") })
  expect(updated.status).toBe("failed")
})', 'req-17', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-18', 'passed', 'vitest', 'import { updateTestSpecStatuses } from "@/orpc/routes/tests"

test("should reflect status in parent spec", async () => {
  await updateTestSpecStatuses("spec-1")
  const spec = await db.query.testSpec.findFirst({ where: eq(testSpec.id, "spec-1") })
  expect(spec.statuses.passed).toBeGreaterThan(0)
})', 'req-18', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-19', 'passed', 'vitest', 'import { testRouter } from "@/orpc/routes/tests"

test("should fetch all tests for organization", async () => {
  const result = await testRouter.getTests({ organizationId: "org-1" })
  expect(result).toBeInstanceOf(Array)
  expect(result.length).toBeGreaterThan(0)
})', 'req-19', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-20', 'failed', 'vitest', 'import { testRouter } from "@/orpc/routes/tests"

test("should create new test requirement", async () => {
  const result = await testRouter.createRequirement({
    name: "New Requirement",
    specId: "spec-1"
  })
  expect(result.id).toBeDefined()
  // Fails: validation error
})', 'req-20', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-21', 'pending', 'vitest', 'test("should update test spec details", async () => {
  // TODO: Implement spec update test
})', 'req-21', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-22', 'pending', 'vitest', 'test("should delete test spec and cascade", async () => {
  // TODO: Implement cascade delete test
})', 'req-22', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-23', 'passed', 'vitest', 'import { db } from "@/db"
import { organization } from "@/db/schema"

test("should create new organization", async () => {
  const result = await db.insert(organization).values({
    id: "org-new",
    name: "New Org",
    plan: "free"
  })
  expect(result).toBeDefined()
})', 'req-23', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-24', 'passed', 'vitest', 'import { db } from "@/db"
import { member } from "@/db/schema"

test("should add member to organization", async () => {
  const result = await db.insert(member).values({
    id: "member-new",
    organizationId: "org-1",
    userId: "user-1",
    role: "member"
  })
  expect(result).toBeDefined()
})', 'req-24', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('test-25', 'pending', 'vitest', 'test("should list organization members", async () => {
  // TODO: Implement member listing test
})', 'req-25', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);