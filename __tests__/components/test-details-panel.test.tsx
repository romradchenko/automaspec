import { describe, it, expect, vi } from 'vitest'

import type { TestSpec, TestRequirement } from '@/lib/types'

import { TestDetailsPanel } from '@/app/dashboard/test-details-panel'
import { render, screen } from '@testing-library/react'

describe('Test Details Panel', () => {
    it('should display test spec details', () => {
        const mockSpec: TestSpec = {
            id: 'spec-1',
            name: 'Login Tests',
            fileName: 'login.spec.ts',
            description: 'User authentication tests',
            statuses: {
                passed: 2,
                failed: 0,
                pending: 1,
                skipped: 0,
                todo: 0,
                disabled: 0,
                missing: 0,
                deactivated: 0,
                partial: 0
            },
            numberOfTests: 3,
            folderId: 'folder-1',
            organizationId: 'org-1',
            createdAt: new Date(),
            updatedAt: new Date()
        }

        render(
            <TestDetailsPanel
                selectedSpec={mockSpec}
                selectedRequirements={[]}
                selectedTests={[]}
                onEditSpec={vi.fn()}
                onCreateGroup={vi.fn()}
                onCreateTest={vi.fn()}
            />
        )

        expect(screen.getByText('Login Tests')).toBeDefined()
        expect(screen.getByText('User authentication tests')).toBeDefined()
    })

    it('should display test statistics', () => {
        const mockSpec: TestSpec = {
            id: 'spec-1',
            name: 'API Tests',
            fileName: 'api.spec.ts',
            description: 'Backend API tests',
            statuses: {
                passed: 5,
                failed: 2,
                pending: 1,
                skipped: 0,
                todo: 0,
                disabled: 0,
                missing: 0,
                deactivated: 0,
                partial: 0
            },
            numberOfTests: 8,
            folderId: 'folder-1',
            organizationId: 'org-1',
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const mockRequirements: TestRequirement[] = [
            {
                id: 'req-1',
                name: 'Test requirement 1',
                description: 'First requirement',
                order: 0,
                specId: 'spec-1',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]

        render(
            <TestDetailsPanel
                selectedSpec={mockSpec}
                selectedRequirements={mockRequirements}
                selectedTests={[]}
                onEditSpec={vi.fn()}
                onCreateGroup={vi.fn()}
                onCreateTest={vi.fn()}
            />
        )

        // Should display spec name and description
        expect(screen.getByText('API Tests')).toBeDefined()
        expect(screen.getByText('Backend API tests')).toBeDefined()

        // Should display requirements
        expect(screen.getByText('Test requirement 1')).toBeDefined()
    })

    it('should handle no spec selected', () => {
        render(
            <TestDetailsPanel
                selectedSpec={null}
                selectedRequirements={[]}
                selectedTests={[]}
                onEditSpec={vi.fn()}
                onCreateGroup={vi.fn()}
                onCreateTest={vi.fn()}
            />
        )

        // Should show empty state with the actual text from the component
        expect(screen.getByText('Select a spec to view details and requirements')).toBeDefined()
        expect(screen.getByText('Create Folder')).toBeDefined()
        expect(screen.getByText('Create Test')).toBeDefined()
    })
})
