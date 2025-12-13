DELETE FROM test WHERE id LIKE 'analytics-test-%';
DELETE FROM test_requirement WHERE id LIKE 'analytics-req-%';
DELETE FROM test_spec WHERE id LIKE 'analytics-spec-%';
DELETE FROM test_folder WHERE id LIKE 'analytics-folder-%';

INSERT INTO test_folder (id, name, description, parent_folder_id, organization_id, "order", created_at, updated_at) VALUES 
('analytics-folder-1', 'E2E Tests', 'End-to-end integration tests', NULL, 'Sitdv6Ay70FxNarRBkmHnAFVIohJuxKa', 1, datetime('now'), datetime('now')),
('analytics-folder-2', 'Unit Tests', 'Component unit tests', NULL, 'Sitdv6Ay70FxNarRBkmHnAFVIohJuxKa', 2, datetime('now'), datetime('now')),
('analytics-folder-3', 'API Tests', 'Backend API tests', NULL, 'Sitdv6Ay70FxNarRBkmHnAFVIohJuxKa', 3, datetime('now'), datetime('now'));

INSERT INTO test_spec (id, name, file_name, description, statuses, number_of_tests, folder_id, organization_id, created_at, updated_at) VALUES 
('analytics-spec-1', 'Login Flow', 'login-flow.spec.ts', 'User authentication tests', '{"passed":5,"failed":2,"pending":1,"skipped":0,"todo":0,"disabled":0,"missing":0,"deactivated":0,"partial":0}', 8, 'analytics-folder-1', 'Sitdv6Ay70FxNarRBkmHnAFVIohJuxKa', datetime('now'), datetime('now')),
('analytics-spec-2', 'Dashboard Components', 'dashboard.spec.ts', 'Dashboard UI tests', '{"passed":10,"failed":0,"pending":2,"skipped":1,"todo":0,"disabled":0,"missing":0,"deactivated":0,"partial":0}', 13, 'analytics-folder-2', 'Sitdv6Ay70FxNarRBkmHnAFVIohJuxKa', datetime('now'), datetime('now')),
('analytics-spec-3', 'API Routes', 'api-routes.spec.ts', 'REST API endpoint tests', '{"passed":8,"failed":3,"pending":0,"skipped":0,"todo":2,"disabled":0,"missing":0,"deactivated":0,"partial":0}', 13, 'analytics-folder-3', 'Sitdv6Ay70FxNarRBkmHnAFVIohJuxKa', datetime('now'), datetime('now')),
('analytics-spec-4', 'Form Validation', 'form-validation.spec.ts', 'Input validation tests', '{"passed":6,"failed":1,"pending":3,"skipped":0,"todo":0,"disabled":0,"missing":0,"deactivated":0,"partial":0}', 10, 'analytics-folder-2', 'Sitdv6Ay70FxNarRBkmHnAFVIohJuxKa', datetime('now'), datetime('now')),
('analytics-spec-stale-1', 'Legacy Auth Tests', 'legacy-auth.spec.ts', 'Old authentication tests', '{"passed":3,"failed":2,"pending":0,"skipped":0,"todo":0,"disabled":0,"missing":0,"deactivated":0,"partial":0}', 5, 'analytics-folder-1', 'Sitdv6Ay70FxNarRBkmHnAFVIohJuxKa', datetime('now', '-45 days'), datetime('now', '-45 days')),
('analytics-spec-stale-2', 'Deprecated API', 'deprecated-api.spec.ts', 'Old API endpoint tests', '{"passed":2,"failed":4,"pending":1,"skipped":0,"todo":0,"disabled":0,"missing":0,"deactivated":0,"partial":0}', 7, 'analytics-folder-3', 'Sitdv6Ay70FxNarRBkmHnAFVIohJuxKa', datetime('now', '-60 days'), datetime('now', '-60 days')),
('analytics-spec-stale-3', 'Old Utils', 'old-utils.spec.ts', 'Legacy utility tests', '{"passed":1,"failed":1,"pending":2,"skipped":0,"todo":0,"disabled":0,"missing":0,"deactivated":0,"partial":0}', 4, 'analytics-folder-2', 'Sitdv6Ay70FxNarRBkmHnAFVIohJuxKa', datetime('now', '-35 days'), datetime('now', '-35 days'));

INSERT INTO test_requirement (id, name, description, "order", spec_id, created_at, updated_at) VALUES 
('analytics-req-1', 'User can login with valid credentials', 'Verify successful login flow', 1, 'analytics-spec-1', datetime('now'), datetime('now')),
('analytics-req-2', 'User sees error for invalid password', 'Display error message on failed login', 2, 'analytics-spec-1', datetime('now'), datetime('now')),
('analytics-req-3', 'Dashboard renders correctly', 'All dashboard components load', 1, 'analytics-spec-2', datetime('now'), datetime('now')),
('analytics-req-4', 'API returns 200 on success', 'Successful API response', 1, 'analytics-spec-3', datetime('now'), datetime('now')),
('analytics-req-5', 'Form validates required fields', 'Required field validation', 1, 'analytics-spec-4', datetime('now'), datetime('now')),
('analytics-req-6', 'Legacy auth still works', 'Backward compatibility', 1, 'analytics-spec-stale-1', datetime('now', '-45 days'), datetime('now', '-45 days')),
('analytics-req-7', 'Old API endpoints respond', 'Deprecated endpoint tests', 1, 'analytics-spec-stale-2', datetime('now', '-60 days'), datetime('now', '-60 days')),
('analytics-req-8', 'Dashboard metrics display', 'Metrics cards render', 2, 'analytics-spec-2', datetime('now'), datetime('now')),
('analytics-req-9', 'Dashboard charts load', 'Charts render with data', 3, 'analytics-spec-2', datetime('now'), datetime('now')),
('analytics-req-10', 'API handles errors gracefully', 'Error response handling', 2, 'analytics-spec-3', datetime('now'), datetime('now'));

INSERT INTO test (id, status, framework, code, requirement_id, created_at, updated_at) VALUES 
('analytics-test-1', 'passed', 'vitest', 'test("login success", () => expect(true).toBe(true))', 'analytics-req-1', datetime('now'), datetime('now')),
('analytics-test-2', 'passed', 'vitest', 'test("login redirect", () => expect(true).toBe(true))', 'analytics-req-1', datetime('now'), datetime('now')),
('analytics-test-3', 'failed', 'vitest', 'test("login error", () => expect(false).toBe(true))', 'analytics-req-2', datetime('now'), datetime('now')),
('analytics-test-4', 'passed', 'vitest', 'test("dashboard loads", () => expect(true).toBe(true))', 'analytics-req-3', datetime('now', '-1 days'), datetime('now', '-1 days')),
('analytics-test-5', 'passed', 'vitest', 'test("components render", () => expect(true).toBe(true))', 'analytics-req-3', datetime('now', '-1 days'), datetime('now', '-1 days')),
('analytics-test-6', 'pending', 'vitest', 'test.todo("sidebar toggle")', 'analytics-req-3', datetime('now', '-2 days'), datetime('now', '-2 days')),
('analytics-test-7', 'passed', 'vitest', 'test("API 200", () => expect(true).toBe(true))', 'analytics-req-4', datetime('now', '-3 days'), datetime('now', '-3 days')),
('analytics-test-8', 'failed', 'vitest', 'test("API auth", () => expect(false).toBe(true))', 'analytics-req-4', datetime('now', '-3 days'), datetime('now', '-3 days')),
('analytics-test-9', 'passed', 'vitest', 'test("required fields", () => expect(true).toBe(true))', 'analytics-req-5', datetime('now', '-5 days'), datetime('now', '-5 days')),
('analytics-test-10', 'pending', 'vitest', 'test.todo("email format")', 'analytics-req-5', datetime('now', '-5 days'), datetime('now', '-5 days')),
('analytics-test-11', 'passed', 'vitest', 'test("legacy login", () => expect(true).toBe(true))', 'analytics-req-6', datetime('now', '-7 days'), datetime('now', '-7 days')),
('analytics-test-12', 'failed', 'vitest', 'test("legacy token", () => expect(false).toBe(true))', 'analytics-req-6', datetime('now', '-7 days'), datetime('now', '-7 days')),
('analytics-test-13', 'passed', 'vitest', 'test("old endpoint", () => expect(true).toBe(true))', 'analytics-req-7', datetime('now', '-10 days'), datetime('now', '-10 days')),
('analytics-test-14', 'passed', 'vitest', 'test("metrics cards", () => expect(true).toBe(true))', 'analytics-req-8', datetime('now', '-12 days'), datetime('now', '-12 days')),
('analytics-test-15', 'passed', 'vitest', 'test("charts render", () => expect(true).toBe(true))', 'analytics-req-9', datetime('now', '-14 days'), datetime('now', '-14 days')),
('analytics-test-16', 'skipped', 'vitest', 'test.skip("chart animations")', 'analytics-req-9', datetime('now', '-14 days'), datetime('now', '-14 days')),
('analytics-test-17', 'passed', 'vitest', 'test("error handling", () => expect(true).toBe(true))', 'analytics-req-10', datetime('now', '-18 days'), datetime('now', '-18 days')),
('analytics-test-18', 'failed', 'vitest', 'test("timeout handling", () => expect(false).toBe(true))', 'analytics-req-10', datetime('now', '-20 days'), datetime('now', '-20 days')),
('analytics-test-19', 'passed', 'vitest', 'test("rate limiting", () => expect(true).toBe(true))', 'analytics-req-10', datetime('now', '-25 days'), datetime('now', '-25 days')),
('analytics-test-20', 'todo', 'vitest', 'test.todo("retry logic")', 'analytics-req-10', datetime('now', '-28 days'), datetime('now', '-28 days'));

