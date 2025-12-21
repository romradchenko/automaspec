import type { Query, QueryClient } from '@tanstack/react-query'

import { describe, expect, it, vi } from 'vitest'

import { invalidateAndRefetchQueries } from '@/app/dashboard/hooks'

describe('invalidateAndRefetchQueries', () => {
    it('invalidates and refetches queries matching a path predicate', async () => {
        const invalidateQueries = vi.fn()
        const refetchQueries = vi.fn()

        await invalidateAndRefetchQueries(
            { invalidateQueries, refetchQueries } as unknown as QueryClient,
            '/test-folders'
        )

        expect(invalidateQueries).toHaveBeenCalledTimes(1)
        expect(refetchQueries).toHaveBeenCalledTimes(1)

        const predicate = invalidateQueries.mock.calls[0]?.[0]?.predicate as
            | ((query: Query<unknown, Error, unknown, readonly unknown[]>) => boolean)
            | undefined

        const matchingQuery = { queryKey: [{ path: '/test-folders' }] } as unknown as Query<
            unknown,
            Error,
            unknown,
            readonly unknown[]
        >
        const nonMatchingQuery = { queryKey: [{ path: '/other' }] } as unknown as Query<
            unknown,
            Error,
            unknown,
            readonly unknown[]
        >
        const invalidQueryKey = { queryKey: ['plain'] } as unknown as Query<unknown, Error, unknown, readonly unknown[]>

        expect(predicate?.(matchingQuery)).toBe(true)
        expect(predicate?.(nonMatchingQuery)).toBe(false)
        expect(predicate?.(invalidQueryKey)).toBe(false)
        expect(refetchQueries.mock.calls[0]?.[0]?.predicate).toBe(predicate)
    })
})
