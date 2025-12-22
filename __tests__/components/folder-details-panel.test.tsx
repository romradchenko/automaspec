import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { FolderDetailsPanel } from '@/app/dashboard/components/folder-details-panel'

const mocks = vi.hoisted(() => {
    const invalidateAndRefetchQueries = vi.fn()
    const testFoldersUpsert = vi.fn()
    const testSpecsUpsert = vi.fn()
    const toastSuccess = vi.fn()
    const toastError = vi.fn()
    return { invalidateAndRefetchQueries, testFoldersUpsert, testSpecsUpsert, toastSuccess, toastError }
})

vi.mock('@/app/dashboard/hooks', () => ({
    invalidateAndRefetchQueries: mocks.invalidateAndRefetchQueries
}))

vi.mock('@/lib/shared/better-auth-client', () => ({
    authClient: {
        useActiveOrganization: () => ({ data: { id: 'org-1' } })
    }
}))

vi.mock('@/lib/orpc/orpc', () => ({
    safeClient: {
        testFolders: {
            upsert: mocks.testFoldersUpsert
        },
        testSpecs: {
            upsert: mocks.testSpecsUpsert
        }
    }
}))

vi.mock('sonner', () => ({
    toast: {
        success: mocks.toastSuccess,
        error: mocks.toastError
    }
}))

const createQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false }
        }
    })

const renderWithProviders = (
    component: React.ReactElement,
    queryClient: QueryClient = createQueryClient()
): { queryClient: QueryClient } => {
    render(<QueryClientProvider client={queryClient}>{component}</QueryClientProvider>)
    return { queryClient }
}

describe('FolderDetailsPanel', () => {
    beforeEach(() => {
        mocks.testFoldersUpsert.mockResolvedValue({ data: { id: 'folder-123' }, error: null })
        mocks.testSpecsUpsert.mockResolvedValue({ data: { id: 'spec-123' }, error: null })
        mocks.invalidateAndRefetchQueries.mockResolvedValue(undefined)
        mocks.toastSuccess.mockClear()
        mocks.toastError.mockClear()
    })

    it('creates a folder from the empty state and refreshes the root tree', async () => {
        const refreshTree = vi.fn()
        const uuidSpy = vi.spyOn(crypto, 'randomUUID').mockReturnValue('generated-folder-id')
        const { queryClient } = renderWithProviders(
            <FolderDetailsPanel selectedFolder={null} onDeleteFolder={vi.fn()} onRefreshTreeChildren={refreshTree} />
        )

        fireEvent.click(screen.getByText('New Folder'))

        await waitFor(() => expect(mocks.testFoldersUpsert).toHaveBeenCalledTimes(1))
        const upsertInput = mocks.testFoldersUpsert.mock.calls[0]?.[0]
        expect(upsertInput?.name).toBe('New Folder')
        expect(upsertInput?.organizationId).toBe('org-1')
        expect(upsertInput?.order).toBe(0)
        expect(upsertInput?.id).toBe('generated-folder-id')
        expect(mocks.invalidateAndRefetchQueries).toHaveBeenCalledWith(queryClient, '/test-folders')
        expect(refreshTree).toHaveBeenCalledWith(null)
        expect(mocks.toastSuccess).toHaveBeenCalledWith('Folder created successfully')
        uuidSpy.mockRestore()
    })

    it('creates a test spec from the empty state', async () => {
        const refreshTree = vi.fn()
        const uuidSpy = vi.spyOn(crypto, 'randomUUID').mockReturnValue('generated-spec-id')
        const { queryClient } = renderWithProviders(
            <FolderDetailsPanel selectedFolder={null} onDeleteFolder={vi.fn()} onRefreshTreeChildren={refreshTree} />
        )

        fireEvent.click(screen.getByText('New Spec'))

        await waitFor(() => expect(mocks.testSpecsUpsert).toHaveBeenCalledTimes(1))
        const upsertInput = mocks.testSpecsUpsert.mock.calls[0]?.[0]
        expect(upsertInput?.folderId).toBeNull()
        expect(upsertInput?.organizationId).toBe('org-1')
        expect(upsertInput?.id).toBe('generated-spec-id')
        expect(mocks.invalidateAndRefetchQueries).toHaveBeenCalledWith(queryClient, '/test-specs')
        expect(refreshTree).toHaveBeenCalledWith(null)
        expect(mocks.toastSuccess).toHaveBeenCalledWith('Test created successfully')
        uuidSpy.mockRestore()
    })
})
