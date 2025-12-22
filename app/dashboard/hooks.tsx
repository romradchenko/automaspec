'use client'

import type { QueryClient, Query } from '@tanstack/react-query'

function createQueryPredicate(path: string) {
    return (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
        const queryKey = query.queryKey
        if (!Array.isArray(queryKey) || queryKey.length === 0) return false
        const firstKey = queryKey[0]
        if (typeof firstKey !== 'object' || firstKey === null) return false
        return 'path' in firstKey && firstKey.path === path
    }
}

export async function invalidateAndRefetchQueries(queryClient: QueryClient, path: string) {
    const predicate = createQueryPredicate(path)
    await queryClient.invalidateQueries({ predicate })
    await queryClient.refetchQueries({ predicate })
}
