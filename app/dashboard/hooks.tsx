'use client'

import { useQuery, type QueryClient, type Query } from '@tanstack/react-query'
import { orpc } from '@/lib/orpc/orpc'
import { type TestFolder, type TestSpec, type TestRequirement, } from '@/lib/types'


export function useFolders(parentFolderId: TestFolder['parentFolderId']) {
    const { data: folders, isLoading: foldersLoading } = useQuery(
        orpc.testFolders.list.queryOptions({
            input: { parentFolderId }
        })
    )

    return {
        folders: folders ?? [],
        foldersLoading
    }
}

export function useSpecs(folderId: TestSpec['folderId']) {
    const { data: specs, isLoading: specsLoading } = useQuery(
        orpc.testSpecs.list.queryOptions({
            input: { folderId }
        })
    )

    return { specs: specs ?? [], specsLoading }
}

export function useRequirements(specId: TestSpec['id']) {
    const { data: requirements, isLoading: requirementsLoading } = useQuery(
        orpc.testRequirements.list.queryOptions({
            input: { specId }
        })
    )

    return { requirements: requirements ?? [], requirementsLoading }
}

export function useTests(requirementId: TestRequirement['id']) {
    const { data: tests, isLoading: testsLoading } = useQuery(
        orpc.tests.list.queryOptions({
            input: { requirementId }
        })
    )

    return { tests: tests ?? [], testsLoading }
}

export function createQueryPredicate(path: string) {
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
    queryClient.invalidateQueries({ predicate })
    await queryClient.refetchQueries({ predicate })
}
