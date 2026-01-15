import { getTableName } from 'drizzle-orm'
import { describe, it, expect } from 'vitest'

import { organization, member, user } from '@/db/schema/auth'
import { testFolder, testSpec, testRequirement, test, DEFAULT_SPEC_STATUSES } from '@/db/schema/tests'
import { SPEC_STATUSES } from '@/lib/constants'

describe('Database Schema', () => {
    describe('Test Tables', () => {
        it('should have testFolder table defined', () => {
            expect(testFolder).toBeDefined()
            expect(getTableName(testFolder)).toBe('test_folder')
        })

        it('should have testSpec table defined', () => {
            expect(testSpec).toBeDefined()
            expect(getTableName(testSpec)).toBe('test_spec')
        })

        it('should have testRequirement table defined', () => {
            expect(testRequirement).toBeDefined()
            expect(getTableName(testRequirement)).toBe('test_requirement')
        })

        it('should have test table defined', () => {
            expect(test).toBeDefined()
            expect(getTableName(test)).toBe('test')
        })
    })

    describe('Auth Tables', () => {
        it('should have user table defined', () => {
            expect(user).toBeDefined()
            expect(getTableName(user)).toBe('user')
        })

        it('should have organization table defined', () => {
            expect(organization).toBeDefined()
            expect(getTableName(organization)).toBe('organization')
        })

        it('should have member table defined', () => {
            expect(member).toBeDefined()
            expect(getTableName(member)).toBe('member')
        })
    })

    describe('Table Columns', () => {
        it('testFolder should have required columns', () => {
            const columns = Object.keys(testFolder)
            expect(columns).toContain('id')
            expect(columns).toContain('name')
            expect(columns).toContain('parentFolderId')
            expect(columns).toContain('organizationId')
        })

        it('testSpec should have required columns', () => {
            const columns = Object.keys(testSpec)
            expect(columns).toContain('id')
            expect(columns).toContain('name')
            expect(columns).toContain('fileName')
            expect(columns).toContain('statuses')
            expect(columns).toContain('numberOfTests')
            expect(columns).toContain('folderId')
            expect(columns).toContain('organizationId')
        })

        it('test should have required columns', () => {
            const columns = Object.keys(test)
            expect(columns).toContain('id')
            expect(columns).toContain('status')
            expect(columns).toContain('framework')
            expect(columns).toContain('code')
            expect(columns).toContain('requirementId')
        })
    })

    describe('DEFAULT_SPEC_STATUSES', () => {
        it('should have all spec statuses initialized to 0', () => {
            const statusValues = Object.values(SPEC_STATUSES)
            for (const status of statusValues) {
                expect(DEFAULT_SPEC_STATUSES[status]).toBe(0)
            }
        })

        it('should have the same keys as SPEC_STATUSES values', () => {
            const expectedKeys = Object.values(SPEC_STATUSES)
            const actualKeys = Object.keys(DEFAULT_SPEC_STATUSES)
            expect(actualKeys.sort()).toEqual(expectedKeys.sort())
        })
    })
})
