'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { FolderDetailsPanel } from '@/app/dashboard/components/folder-details-panel'

vi.mock('@/app/dashboard/hooks')
vi.mock('@/lib/shared/better-auth-client', () => ({
    authClient: {
        useActiveOrganization: () => ({ data: { id: 'org-1' } })
    }
}))
vi.mock('@/lib/orpc/orpc')
vi.mock('sonner')

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
    const selectedFolder = {
        id: 'folder-1',
        name: 'Test Folder',
        description: null,
        organizationId: 'org-1',
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        parentFolderId: null
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('shows empty state when no folder is selected', () => {
        renderWithProviders(
            <FolderDetailsPanel
                selectedFolder={null}
                onRenameFolder={vi.fn()}
                onDeleteFolder={vi.fn()}
                onSpecSelect={vi.fn()}
                onRefreshTreeChildren={vi.fn()}
            />
        )

        expect(screen.getByText('Select a spec to view details and requirements')).toBeDefined()
        expect(screen.getByText('New Folder')).toBeDefined()
        expect(screen.getByText('New Spec')).toBeDefined()
    })

    it('shows empty state when folder has no specs', () => {
        renderWithProviders(
            <FolderDetailsPanel
                selectedFolder={selectedFolder}
                onRenameFolder={vi.fn()}
                onDeleteFolder={vi.fn()}
                onSpecSelect={vi.fn()}
                onRefreshTreeChildren={vi.fn()}
            />
        )

        expect(screen.getByText('No test specs yet')).toBeDefined()
        expect(screen.getByText('Create your first test spec to get started')).toBeDefined()
        expect(screen.getByText('No subfolders yet')).toBeDefined()
        expect(screen.getByText('Create subfolders to organize your test specs')).toBeDefined()
    })

    it('shows empty state when folder has no subfolders', () => {
        renderWithProviders(
            <FolderDetailsPanel
                selectedFolder={selectedFolder}
                onRenameFolder={vi.fn()}
                onDeleteFolder={vi.fn()}
                onSpecSelect={vi.fn()}
                onRefreshTreeChildren={vi.fn()}
            />
        )

        expect(screen.getByText('No subfolders yet')).toBeDefined()
        expect(screen.getByText('Create subfolders to organize your test specs')).toBeDefined()
    })

    it('displays folder statistics', () => {
        renderWithProviders(
            <FolderDetailsPanel
                selectedFolder={selectedFolder}
                onRenameFolder={vi.fn()}
                onDeleteFolder={vi.fn()}
                onSpecSelect={vi.fn()}
                onRefreshTreeChildren={vi.fn()}
            />
        )

        expect(screen.getByText('Subfolders')).toBeDefined()
        expect(screen.getByText('Test Specs')).toBeDefined()
        expect(screen.getByText('Passed')).toBeDefined()
        expect(screen.getByText('Failed')).toBeDefined()
        expect(screen.getByText('Skipped')).toBeDefined()
        expect(screen.getByText('Pending')).toBeDefined()
    })
})
