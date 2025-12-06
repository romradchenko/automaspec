import { beforeEach, describe, expect, it, vi } from 'vitest'

import { testSpec as testSpecTable, test as testTable } from '@/db/schema'
import { TEST_STATUSES } from '@/lib/constants'
import { router } from '@/orpc/routes'
import { createRouterClient } from '@orpc/server'

let orgTests: Array<Record<string, unknown>> = []
let allSpecTests: Array<Record<string, unknown>> = []

vi.mock('@/db', () => {
    const update = vi.fn((_table: unknown) => ({
        set: () => ({
            where: () => {
                return Promise.resolve()
            }
        })
    }))

    let selectCall = 0
    const select = vi.fn(() => ({
        from: () => ({
            innerJoin: () => ({
                innerJoin: () => ({
                    where: () => {
                        const r = selectCall === 0 ? orgTests : allSpecTests
                        selectCall++
                        return Promise.resolve(r)
                    }
                })
            })
        })
    }))

    const reset = () => {
        selectCall = 0
        update.mockClear()
        select.mockClear()
    }

    return { db: { update, select }, __esModule: true, reset }
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

    beforeEach(async () => {
        orgTests = [
            { testId: 'A', testStatus: TEST_STATUSES.failed, requirementName: 'Req A', specId: 'spec-1' },
            { testId: 'B', testStatus: TEST_STATUSES.passed, requirementName: 'Req B', specId: 'spec-1' },
            { testId: 'C', testStatus: TEST_STATUSES.passed, requirementName: 'Req C', specId: 'spec-2' }
        ]
        allSpecTests = [
            { specId: 'spec-1', status: TEST_STATUSES.passed },
            { specId: 'spec-1', status: TEST_STATUSES.missing },
            { specId: 'spec-2', status: TEST_STATUSES.missing }
        ]
        const m = (await import('@/db')) as unknown as { reset: () => void }
        m.reset()
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

        expect(data).toEqual({ updated: 2, missing: 1 })

        const m = (await import('@/db')) as unknown as { db: { update: { mock: { calls: unknown[][] } } } }
        const calls = m.db.update.mock.calls
        expect(calls.length).toBeGreaterThanOrEqual(3)
        expect(calls[0][0]).toBe(testTable)
        expect(calls.some((call) => call[0] === testSpecTable)).toBe(true)
    })
})
