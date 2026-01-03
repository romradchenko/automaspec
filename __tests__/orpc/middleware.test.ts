import { createRouterClient } from '@orpc/server'
import { describe, expect, it, vi } from 'vitest'

import { router } from '@/orpc/routes'

const dbMocks = vi.hoisted(() => {
    return {
        select: vi.fn()
    }
})

vi.mock('@/db', () => {
    return { db: { select: dbMocks.select }, __esModule: true }
})

describe('orpc middleware', () => {
    it('rejects calls without a session', async () => {
        const client = createRouterClient(router, { context: async () => ({}) })

        await expect(client.analytics.getMetrics({ period: '30d' })).rejects.toThrow('Session not found')
    })

    it('rejects calls without an active organization', async () => {
        const client = createRouterClient(router, {
            context: async () => ({
                session: {
                    session: {
                        userId: 'user-1'
                    },
                    user: { id: 'user-1' }
                }
            })
        })

        await expect(client.analytics.getMetrics({ period: '30d' })).rejects.toThrow('User has no active organization')
    })
})
