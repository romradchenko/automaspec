import { describe, expect, it, vi, afterEach } from 'vitest'

import { getDatabaseUrl } from '@/lib/get-database-url'

afterEach(() => {
    vi.unstubAllEnvs()
})

describe('getDatabaseUrl', () => {
    it('returns local url in development', () => {
        vi.stubEnv('NODE_ENV', 'development')
        vi.stubEnv('NEXT_PUBLIC_DATABASE_LOCAL_URL', 'file:db/custom.db')

        expect(getDatabaseUrl()).toBe('file:db/custom.db')
    })

    it('falls back to default local file in development', () => {
        vi.stubEnv('NODE_ENV', 'development')
        delete process.env.NEXT_PUBLIC_DATABASE_LOCAL_URL

        expect(getDatabaseUrl()).toBe('file:db/local.db')
    })

    it('returns production url outside development', () => {
        vi.stubEnv('NODE_ENV', 'production')
        vi.stubEnv('NEXT_PUBLIC_DATABASE_URL', 'libsql://prod')

        expect(getDatabaseUrl()).toBe('libsql://prod')
    })
})
