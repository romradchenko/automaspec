'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

import { DEFAULT_SPEC_STATUSES } from '@/db/schema'
import { safeClient } from '@/lib/orpc/orpc'
import { authClient } from '@/lib/shared/better-auth-client'
import { TestFolder } from '@/lib/types'

import { invalidateAndRefetchQueries } from '../hooks'
import { DeleteConfirmDialog } from './delete-confirm-dialog'
import { FolderDetailsHeader } from './folder-details-header'
import { TestDetailsEmptyState } from './test-details-empty-state'

export interface FolderDetailsPanelProps {
    selectedFolder: TestFolder | null
    onDeleteFolder: (folderId: string) => void
    onRefreshTreeChildren?: (parentFolderId: string | null) => Promise<void> | void
}

export function FolderDetailsPanel({ selectedFolder, onDeleteFolder, onRefreshTreeChildren }: FolderDetailsPanelProps) {
    const [deleteFolderDialogOpen, setDeleteFolderDialogOpen] = useState(false)
    const { data: activeOrganization } = authClient.useActiveOrganization()
    const queryClient = useQueryClient()
    const createFolderMutation = useMutation({
        mutationFn: async () => {
            if (!activeOrganization?.id) {
                throw new Error('No active organization')
            }
            const { data, error } = await safeClient.testFolders.upsert({
                id: crypto.randomUUID(),
                name: 'New Folder',
                organizationId: activeOrganization.id,
                order: 0
            })
            if (error) throw error
            return data
        },
        onSuccess: async () => {
            await invalidateAndRefetchQueries(queryClient, '/test-folders')
            await onRefreshTreeChildren?.(selectedFolder?.id ?? null)
            toast.success('Folder created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create folder')
        }
    })

    const createTestSpecMutation = useMutation({
        mutationFn: async () => {
            if (!activeOrganization?.id) {
                throw new Error('No active organization')
            }
            const { data, error } = await safeClient.testSpecs.upsert({
                id: crypto.randomUUID(),
                name: 'New Spec',
                folderId: selectedFolder?.id || null,
                organizationId: activeOrganization.id,
                statuses: DEFAULT_SPEC_STATUSES,
                numberOfTests: 0
            })
            if (error) throw error
            return data
        },
        onSuccess: async () => {
            await invalidateAndRefetchQueries(queryClient, '/test-specs')
            await onRefreshTreeChildren?.(selectedFolder?.id ?? null)
            toast.success('Test created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create test')
        }
    })

    if (!selectedFolder) {
        return (
            <TestDetailsEmptyState
                onCreateFolder={() => createFolderMutation.mutate()}
                onCreateTest={() => createTestSpecMutation.mutate()}
                isCreatingFolder={createFolderMutation.isPending}
                isCreatingTest={createTestSpecMutation.isPending}
            />
        )
    }

    return (
        <>
            <FolderDetailsHeader folder={selectedFolder} onDelete={() => setDeleteFolderDialogOpen(true)} />

            <div className="flex-1 overflow-auto p-3 sm:p-4">
                <div className="space-y-4">
                    <div>
                        <h3 className="mb-3 font-medium text-sm sm:text-base">Folder Information</h3>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="text-muted-foreground">Name:</span>{' '}
                                <span className="font-medium">{selectedFolder.name}</span>
                            </div>
                            {selectedFolder.description && (
                                <div>
                                    <span className="text-muted-foreground">Description:</span>{' '}
                                    <span>{selectedFolder.description}</span>
                                </div>
                            )}
                            <div>
                                <span className="text-muted-foreground">Order:</span>{' '}
                                <span>{selectedFolder.order}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DeleteConfirmDialog
                open={deleteFolderDialogOpen}
                onOpenChange={setDeleteFolderDialogOpen}
                title="Delete Folder"
                description="Are you sure you want to delete this folder? This will also delete all folders and tests inside it. This action cannot be undone."
                onConfirm={() => onDeleteFolder(selectedFolder.id)}
            />
        </>
    )
}
