'use client'

import type { QueryClient, Query } from '@tanstack/react-query'

function normalizeQueryKeyPath(path: string): { pathWithSlash: string; pathKey: string } {
    const trimmed = path.trim()
    const pathWithSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
    const pathKey = pathWithSlash.replace(/^\//, '')

    return { pathWithSlash, pathKey }
}

function createQueryPredicate(path: string) {
    const { pathWithSlash, pathKey } = normalizeQueryKeyPath(path)

    return (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
        const queryKey = query.queryKey
        if (!Array.isArray(queryKey) || queryKey.length === 0) return false
        const firstKey = queryKey[0]

        if (typeof firstKey === 'string') {
            return firstKey === pathKey || firstKey === pathWithSlash
        }

        if (typeof firstKey !== 'object' || firstKey === null) return false
        if (!('path' in firstKey)) return false

        const record = firstKey as Record<string, unknown>
        return record.path === pathWithSlash || record.path === pathKey
    }
}

export async function invalidateAndRefetchQueries(queryClient: QueryClient, path: string) {
    const predicate = createQueryPredicate(path)
    await queryClient.invalidateQueries({ predicate })
    await queryClient.refetchQueries({ predicate })
}
