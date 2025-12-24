'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Folder, FileText, CircleCheck, CircleX, CircleSlash, CircleDashed } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import type { TestFolder, TestSpec } from '@/lib/types'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DEFAULT_SPEC_STATUSES } from '@/db/schema'
import { STATUS_CONFIGS, TEST_STATUSES } from '@/lib/constants'
import { safeClient } from '@/lib/orpc/orpc'
import { authClient } from '@/lib/shared/better-auth-client'

import { invalidateAndRefetchQueries } from '../hooks'
import { CreateFolderDialog } from './create-folder-dialog'
import { CreateSpecDialog } from './create-spec-dialog'
import { DeleteConfirmDialog } from './delete-confirm-dialog'
import { FolderDetailsHeader } from './folder-details-header'
import { TestDetailsEmptyState } from './test-details-empty-state'

export interface FolderDetailsPanelProps {
    selectedFolder: TestFolder | null
    onRenameFolder: (folderId: string, name: string) => void
    onDeleteFolder: (folderId: string) => void
    onSpecSelect?: (spec: TestSpec) => void
    onFolderSelect?: (folderId: string) => void
    onRefreshTreeChildren?: (parentFolderId: string | null) => Promise<void> | void
}

export function FolderDetailsPanel({
    selectedFolder,
    onRenameFolder,
    onDeleteFolder,
    onSpecSelect,
    onFolderSelect,
    onRefreshTreeChildren
}: FolderDetailsPanelProps) {
    const [deleteFolderDialogOpen, setDeleteFolderDialogOpen] = useState(false)
    const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false)
    const [createSpecDialogOpen, setCreateSpecDialogOpen] = useState(false)
    const { data: activeOrganization } = authClient.useActiveOrganization()
    const queryClient = useQueryClient()

    const { data: folders = [] } = useQuery({
        queryKey: ['test-folders'],
        queryFn: async () => {
            const res = await safeClient.testFolders.list({})
            return res.data || []
        }
    })

    const { data: specs = [] } = useQuery({
        queryKey: ['test-specs'],
        queryFn: async () => {
            const res = await safeClient.testSpecs.list({})
            return res.data || []
        }
    })

    const { data: requirements = [] } = useQuery({
        queryKey: ['test-requirements'],
        queryFn: async () => {
            const res = await safeClient.testRequirements.list({})
            return res.data || []
        }
    })

    const { data: tests = [] } = useQuery({
        queryKey: ['tests'],
        queryFn: async () => {
            const res = await safeClient.tests.list({})
            return res.data || []
        }
    })

    const subfolders = folders?.filter((f) => f.parentFolderId === selectedFolder?.id) || []
    const folderSpecs = specs?.filter((s) => s.folderId === selectedFolder?.id) || []

    const specIds = new Set(folderSpecs.map((s) => s.id))
    const folderRequirements = requirements.filter((r) => specIds.has(r.specId))
    const requirementIds = new Set(folderRequirements.map((r) => r.id))
    const folderTests = tests.filter((t) => requirementIds.has(t.requirementId))

    const stats = {
        subfolders: subfolders.length,
        specs: folderSpecs.length,
        totalTests: folderTests.length,
        passed: folderTests.filter((t) => t.status === TEST_STATUSES.passed).length,
        failed: folderTests.filter((t) => t.status === TEST_STATUSES.failed).length,
        skipped: folderTests.filter((t) => t.status === TEST_STATUSES.skipped).length,
        pending: folderTests.filter((t) => t.status === TEST_STATUSES.pending).length
    }

    const createFolderMutation = useMutation({
        mutationFn: async (name: string) => {
            if (!activeOrganization?.id) {
                throw new Error('No active organization')
            }
            const { data, error } = await safeClient.testFolders.upsert({
                id: crypto.randomUUID(),
                name,
                organizationId: activeOrganization.id,
                parentFolderId: selectedFolder?.id || null,
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
        mutationFn: async (name: string) => {
            if (!activeOrganization?.id) {
                throw new Error('No active organization')
            }
            const { data, error } = await safeClient.testSpecs.upsert({
                id: crypto.randomUUID(),
                name,
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
            <>
                <TestDetailsEmptyState
                    onCreateFolder={() => setCreateFolderDialogOpen(true)}
                    onCreateTest={() => setCreateSpecDialogOpen(true)}
                />
                <CreateFolderDialog
                    open={createFolderDialogOpen}
                    onOpenChange={setCreateFolderDialogOpen}
                    onCreateFolder={(name) => createFolderMutation.mutate(name)}
                    isCreating={createFolderMutation.isPending}
                />
                <CreateSpecDialog
                    open={createSpecDialogOpen}
                    onOpenChange={setCreateSpecDialogOpen}
                    onCreateSpec={(name) => createTestSpecMutation.mutate(name)}
                    isCreating={createTestSpecMutation.isPending}
                />
            </>
        )
    }

    return (
        <>
            <FolderDetailsHeader
                folder={selectedFolder}
                onRename={(name) => onRenameFolder(selectedFolder.id, name)}
                onDelete={() => setDeleteFolderDialogOpen(true)}
            />

            <div className="flex-1 overflow-auto p-3 sm:p-4">
                <div className="space-y-6">
                    <div>
                        <h3 className="mb-3 font-medium text-sm sm:text-base">Statistics</h3>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <div className="rounded-lg border bg-card p-3">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Folder className="size-4" />
                                    <span className="text-xs">Subfolders</span>
                                </div>
                                <p className="mt-1 text-2xl font-semibold">{stats.subfolders}</p>
                            </div>
                            <div className="rounded-lg border bg-card p-3">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <FileText className="size-4" />
                                    <span className="text-xs">Test Specs</span>
                                </div>
                                <p className="mt-1 text-2xl font-semibold">{stats.specs}</p>
                            </div>
                            <div className="rounded-lg border bg-card p-3">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <CircleCheck className="size-4 text-green-500" />
                                    <span className="text-xs">Passed</span>
                                </div>
                                <p className="mt-1 text-2xl font-semibold">{stats.passed}</p>
                            </div>
                            <div className="rounded-lg border bg-card p-3">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <CircleX className="size-4 text-red-500" />
                                    <span className="text-xs">Failed</span>
                                </div>
                                <p className="mt-1 text-2xl font-semibold">{stats.failed}</p>
                            </div>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                            <div className="rounded-lg border bg-card p-3">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <CircleSlash className="size-4 text-yellow-500" />
                                    <span className="text-xs">Skipped</span>
                                </div>
                                <p className="mt-1 text-2xl font-semibold">{stats.skipped}</p>
                            </div>
                            <div className="rounded-lg border bg-card p-3">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <CircleDashed className="size-4 text-gray-500" />
                                    <span className="text-xs">Pending</span>
                                </div>
                                <p className="mt-1 text-2xl font-semibold">{stats.pending}</p>
                            </div>
                        </div>
                    </div>

                    {folderSpecs.length > 0 && (
                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="font-medium text-sm sm:text-base">Test Specs</h3>
                                <Button onClick={() => setCreateSpecDialogOpen(true)} size="sm" variant="outline">
                                    New Spec
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {folderSpecs.map((spec) => (
                                    <div
                                        key={spec.id}
                                        className="flex items-center justify-between rounded-lg border bg-card p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                                        onClick={() => onSpecSelect?.(spec)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault()
                                                onSpecSelect?.(spec)
                                            }
                                        }}
                                        role="button"
                                        tabIndex={0}
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <FileText className="size-4 text-muted-foreground" />
                                                <span className="font-medium">{spec.name}</span>
                                            </div>
                                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                <span>{spec.fileName || 'No file'}</span>
                                                <span>•</span>
                                                <span>{spec.numberOfTests} tests</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-1">
                                            {Object.entries(spec.statuses)
                                                .filter(([, count]) => count > 0)
                                                .map(([status, count]) => {
                                                    const config = STATUS_CONFIGS[status as keyof typeof STATUS_CONFIGS]
                                                    return (
                                                        <Badge key={status} variant="outline" className={config.color}>
                                                            {count} {config.label}
                                                        </Badge>
                                                    )
                                                })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {subfolders.length > 0 && (
                        <div>
                            <h3 className="mb-3 font-medium text-sm sm:text-base">Subfolders</h3>
                            <div className="space-y-2">
                                {subfolders.map((folder) => (
                                    <div
                                        key={folder.id}
                                        className="flex items-center justify-between rounded-lg border bg-card p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                                        onClick={() => onFolderSelect?.(folder.id)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault()
                                                onFolderSelect?.(folder.id)
                                            }
                                        }}
                                        role="button"
                                        tabIndex={0}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Folder className="size-4 text-muted-foreground" />
                                            <span className="font-medium">{folder.name}</span>
                                        </div>
                                        {folder.description && (
                                            <span className="text-xs text-muted-foreground line-clamp-1">
                                                {folder.description}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <DeleteConfirmDialog
                open={deleteFolderDialogOpen}
                onOpenChange={setDeleteFolderDialogOpen}
                title="Delete Folder"
                description="Are you sure you want to delete this folder? This will also delete all folders and tests inside it. This action cannot be undone."
                onConfirm={() => onDeleteFolder(selectedFolder.id)}
            />
            <CreateFolderDialog
                open={createFolderDialogOpen}
                onOpenChange={setCreateFolderDialogOpen}
                onCreateFolder={(name) => createFolderMutation.mutate(name)}
                isCreating={createFolderMutation.isPending}
            />
            <CreateSpecDialog
                open={createSpecDialogOpen}
                onOpenChange={setCreateSpecDialogOpen}
                onCreateSpec={(name) => createTestSpecMutation.mutate(name)}
                isCreating={createTestSpecMutation.isPending}
            />
        </>
    )
}
