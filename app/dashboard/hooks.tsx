'use client'

import { useQuery, type QueryClient, type Query } from '@tanstack/react-query'
import { orpc } from '@/lib/orpc/orpc'
import { type TestFolder, type TestSpec, type TestRequirement, type SpecStatus } from '@/lib/types'
import { SPEC_STATUSES } from '@/lib/constants'

export function useFolders(parentFolderId: TestFolder['parentFolderId']) {
    const { data: folders, isLoading: foldersLoading } = useQuery(
        orpc.testFolders.list.queryOptions({
            input: { parentFolderId }
        })
    )

    // const folderIds = folders.map((f) => f.id)
    // const folderById = Object.fromEntries(folders.map((f) => [f.id, f]))

    return {
        folders: folders ?? [],
        // folderIds,
        // folderById,
        foldersLoading
    }
}

export function useSpecs(folderId: TestSpec['folderId']) {
    const { data: specs, isLoading: specsLoading } = useQuery(
        orpc.testSpecs.list.queryOptions({
            input: { folderId }
        })
    )

    // const specIds = specs.map((s) => s.id)
    // const specById = Object.fromEntries(specs.map((s) => [s.id, s]))

    return { specs: specs ?? [], specsLoading }
}

export function useRequirements(specId: TestSpec['id']) {
    const { data: requirements, isLoading: requirementsLoading } = useQuery(
        orpc.testRequirements.list.queryOptions({
            input: { specId }
        })
    )

    // const requirementIds = requirements.map((r) => r.id)
    // const requirementById = Object.fromEntries(requirements.map((r) => [r.id, r]))

    return { requirements: requirements ?? [], requirementsLoading }
}

export function useTests(requirementId: TestRequirement['id']) {
    const { data: tests, isLoading: testsLoading } = useQuery(
        orpc.tests.list.queryOptions({
            input: { requirementId }
        })
    )

    // const testIds = tests.map((t) => t.id)
    // const testById = Object.fromEntries(tests.map((t) => [t.id, t]))

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

export function createDefaultSpecStatuses(): Record<SpecStatus, number> {
    return Object.fromEntries(Object.values(SPEC_STATUSES).map((status: SpecStatus) => [status, 0])) as Record<
        SpecStatus,
        number
    >
}
