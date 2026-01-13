import { createRouterClient } from '@orpc/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { testSpec as testSpecTable, test as testTable } from '@/db/schema'
import { TEST_STATUSES } from '@/lib/constants'
import { router } from '@/orpc/routes'

let allRequirements: Array<Record<string, unknown>> = []
let existingTests: Array<Record<string, unknown>> = []
let orgTests: Array<Record<string, unknown>> = []
let allSpecTests: Array<Record<string, unknown>> = []

const dbMocks = vi.hoisted(() => {
    let selectCall = 0
    const update = vi.fn((_table: unknown) => ({
        set: () => ({
            where: async () => undefined
        })
    }))
    const insert = vi.fn(() => ({
        values: async () => undefined
    }))
    const getResult = async () => {
        const results = [allRequirements, existingTests, orgTests, allSpecTests]
        const result = results[selectCall] ?? []
        selectCall += 1
        return Promise.resolve(result)
    }
    const createJoinChain = (): Record<string, unknown> => ({
        innerJoin: () => createJoinChain(),
        where: getResult
    })
    const select = vi.fn(() => ({
        from: () => createJoinChain()
    }))
    const reset = () => {
        selectCall = 0
        update.mockClear()
        select.mockClear()
        insert.mockClear()
    }
    return { update, select, insert, reset }
})

vi.mock('@/db', () => {
    return { db: { update: dbMocks.update, select: dbMocks.select, insert: dbMocks.insert }, __esModule: true }
})

describe('syncReport', () => {
    const ctx = {
        organizationId: 'org-1',
        session: {
            session: {
                activeOrganizationId: 'org-1',
                userId: 'user-1'
            },
            user: { id: 'user-1' }
        }
    }
    const testClient = createRouterClient(router, { context: async () => ctx })

    beforeEach(() => {
        allRequirements = [
            { requirementId: 'req-A', requirementName: 'Req A', specId: 'spec-1' },
            { requirementId: 'req-B', requirementName: 'Req B', specId: 'spec-1' }
        ]
        existingTests = [{ requirementId: 'req-A' }, { requirementId: 'req-B' }]
        orgTests = [
            { testId: 'A', testStatus: TEST_STATUSES.failed, requirementName: 'Req A', specId: 'spec-1' },
            { testId: 'B', testStatus: TEST_STATUSES.passed, requirementName: 'Req B', specId: 'spec-1' }
        ]
        allSpecTests = [
            { specId: 'spec-1', status: TEST_STATUSES.passed },
            { specId: 'spec-1', status: TEST_STATUSES.missing }
        ]
        dbMocks.reset()
    })

    it('updates reported statuses and marks unmatched as missing, in batches', async () => {
        const report = {
            testResults: [
                {
                    assertionResults: [
                        { title: 'Req A', status: TEST_STATUSES.passed },
                        { title: 'Req B', status: TEST_STATUSES.missing }
                    ]
                }
            ]
        }

        const result = await testClient.tests.syncReport(report)
        const data = result
        const error = null

        if (error) throw error

        expect(data).toEqual({ created: 0, updated: 2, missing: 0 })

        const calls = dbMocks.update.mock.calls
        expect(calls.length).toBeGreaterThanOrEqual(3)
        expect(calls[0][0]).toBe(testTable)
        expect(calls.some((call) => call[0] === testSpecTable)).toBe(true)
    })
})
