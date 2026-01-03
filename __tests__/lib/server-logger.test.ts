import { beforeEach, describe, expect, it, vi } from 'vitest'

import { NODE_ENVS } from '@/lib/constants'
import { createServerLogger } from '@/lib/server-logger'

const loggerMocks = vi.hoisted(() => {
    return {
        pino: vi.fn((_options?: unknown) => ({ type: 'pino' })),
        pretty: vi.fn(() => ({ type: 'pretty' }))
    }
})

vi.mock('pino', () => {
    return { default: loggerMocks.pino }
})

vi.mock('pino-pretty', () => {
    return { default: loggerMocks.pretty }
})

describe('createServerLogger', () => {
    beforeEach(() => {
        loggerMocks.pino.mockClear()
        loggerMocks.pretty.mockClear()
        vi.unstubAllEnvs()
    })

    it('uses standard pino logger in production', () => {
        vi.stubEnv('NODE_ENV', NODE_ENVS.production)

        createServerLogger()

        expect(loggerMocks.pretty).not.toHaveBeenCalled()
        expect(loggerMocks.pino).toHaveBeenCalledWith()
    })

    it('uses pretty logger outside production', () => {
        vi.stubEnv('NODE_ENV', NODE_ENVS.development)

        createServerLogger()

        expect(loggerMocks.pretty).toHaveBeenCalledTimes(1)
        expect(loggerMocks.pino).toHaveBeenCalledTimes(1)
        expect(loggerMocks.pino.mock.calls[0]?.[0]).toEqual({ type: 'pretty' })
    })
})
