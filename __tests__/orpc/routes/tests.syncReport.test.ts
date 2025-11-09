import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TEST_STATUSES } from '@/lib/constants'
import { syncReport } from '@/orpc/routes/tests'
import { test as testTable, testSpec as testSpecTable } from '@/db/schema'

let orgTests: Array<Record<string, unknown>> = []
let allSpecTests: Array<Record<string, unknown>> = []

vi.mock('@/db', () => {
    const update = vi.fn((table: unknown) => ({
        set: () => ({
            where: () => Promise.resolve()
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
    const ctx = { organizationId: 'org-1' }

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

        const res = (await syncReport({ input: report, context: ctx })) as unknown as Record<string, unknown>

        expect(res).toEqual({ updated: 2, missing: 1 })

        const m = (await import('@/db')) as unknown as { db: { update: { mock: { calls: unknown[][] } } } }
        const calls = m.db.update.mock.calls
        expect(calls.length).toBe(3)
        expect(calls[0][0]).toBe(testTable)
        expect(calls[1][0]).toBe(testTable)
        expect(calls[2][0]).toBe(testSpecTable)
    })
})
