import { describe, it, expect } from 'vitest'

import { testSpecInsertSchema, testFolderInsertSchema } from '@/lib/types'

describe('Type Schemas', () => {
    describe('testSpecInsertSchema', () => {
        it('should validate required fields', () => {
            const invalid = {
                name: '',
                organizationId: ''
            }

            const result = testSpecInsertSchema.safeParse(invalid)
            expect(result.success).toBe(false)
        })

        it('should accept valid test spec data', () => {
            const valid = {
                id: 'test-spec-1',
                name: 'New Test Spec',
                organizationId: 'org-123',
                folderId: 'folder-1',
                fileName: 'test.spec.ts',
                description: 'Test description',
                statuses: {
                    passed: 0,
                    failed: 0,
                    pending: 0,
                    skipped: 0,
                    todo: 0,
                    disabled: 0,
                    missing: 0,
                    deactivated: 0,
                    partial: 0
                },
                numberOfTests: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            const result = testSpecInsertSchema.safeParse(valid)
            if (!result.success) {
                console.log('Validation errors:', result.error.issues)
            }
            expect(result.success).toBe(true)
        })
    })

    describe('testFolderInsertSchema', () => {
        it('should accept valid folder data', () => {
            const valid = {
                id: 'folder-1',
                name: 'New Folder',
                organizationId: 'org-123',
                description: 'Folder description',
                parentFolderId: null,
                order: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            const result = testFolderInsertSchema.safeParse(valid)
            if (!result.success) {
                console.log('Validation errors:', result.error.issues)
            }
            expect(result.success).toBe(true)
        })

        it('should require organization ID', () => {
            const invalid = {
                name: 'Folder',
                organizationId: ''
            }

            const result = testFolderInsertSchema.safeParse(invalid)
            expect(result.success).toBe(false)
        })
    })
})
