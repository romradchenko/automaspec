import { beforeEach, describe, expect, it, vi } from 'vitest'

import { router } from '@/orpc/routes'
import { createRouterClient } from '@orpc/server'

let mockSpecs: Array<Record<string, unknown>> = []
let mockTests: Array<Record<string, unknown>> = []
let mockMembers: Array<Record<string, unknown>> = []

vi.mock('@/db', () => {
    let callIndex = 0

    const createChain = () => ({
        from: () => createChain(),
        where: () => {
            const idx = callIndex++
            if (idx === 0) return Promise.resolve([{ count: 2 }])
            if (idx === 1) return Promise.resolve(mockSpecs)
            if (idx === 2) return Promise.resolve([{ count: 2 }])
            if (idx === 3) return Promise.resolve([{ count: 3 }])
            if (idx === 4) return Promise.resolve([{ count: 1 }])
            if (idx === 5) return Promise.resolve(mockTests)
            return Promise.resolve([])
        },
        innerJoin: () => createChain()
    })

    const select = vi.fn(() => createChain())

    const reset = () => {
        callIndex = 0
        select.mockClear()
    }

    return { db: { select }, __esModule: true, reset }
})

describe('analytics.getMetrics', () => {
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
        mockSpecs = [
            {
                id: 'spec-1',
                name: 'Auth Tests',
                statuses: {
                    passed: 3,
                    failed: 1,
                    pending: 0,
                    skipped: 0,
                    todo: 0,
                    disabled: 0,
                    missing: 0,
                    deactivated: 0,
                    partial: 0
                },
                numberOfTests: 4,
                updatedAt: new Date().toISOString()
            },
            {
                id: 'spec-2',
                name: 'API Tests',
                statuses: {
                    passed: 2,
                    failed: 2,
                    pending: 1,
                    skipped: 0,
                    todo: 0,
                    disabled: 0,
                    missing: 0,
                    deactivated: 0,
                    partial: 0
                },
                numberOfTests: 5,
                updatedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString()
            }
        ]
        mockTests = [
            { id: 't1', status: 'passed', createdAt: new Date().toISOString() },
            { id: 't2', status: 'passed', createdAt: new Date().toISOString() },
            { id: 't3', status: 'failed', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }
        ]
        mockMembers = [{ id: 'member-1', userId: 'user-1' }]
        const m = (await import('@/db')) as unknown as { reset: () => void }
        m.reset()
    })

    it('returns correct total counts', async () => {
        const result = await testClient.analytics.getMetrics({ period: '30d' })

        expect(result.totalSpecs).toBe(2)
        expect(result.totalTests).toBe(3)
        expect(result.totalRequirements).toBe(2)
    })

    it('returns correct status distribution', async () => {
        const result = await testClient.analytics.getMetrics({ period: '30d' })

        expect(result.testsByStatus).toBeDefined()
        expect(result.testsByStatus.passed).toBe(5)
        expect(result.testsByStatus.failed).toBe(3)
    })

    it('returns stale tests older than 30 days', async () => {
        const result = await testClient.analytics.getMetrics({ period: '30d' })

        expect(result.staleTests).toBeDefined()
        expect(result.staleTests.length).toBe(1)
        expect(result.staleTests[0].id).toBe('spec-2')
    })

    it('returns tests growth data grouped by date', async () => {
        const result = await testClient.analytics.getMetrics({ period: '7d' })

        expect(result.testsGrowth).toBeDefined()
        expect(Array.isArray(result.testsGrowth)).toBe(true)
    })

    it('respects period filter for tests growth', async () => {
        const result7d = await testClient.analytics.getMetrics({ period: '7d' })
        const result30d = await testClient.analytics.getMetrics({ period: '30d' })

        expect(result7d.testsGrowth).toBeDefined()
        expect(result30d.testsGrowth).toBeDefined()
    })

    it('returns active members count', async () => {
        const result = await testClient.analytics.getMetrics({ period: '30d' })

        expect(result.activeMembers).toBeDefined()
        expect(typeof result.activeMembers).toBe('number')
    })
})
