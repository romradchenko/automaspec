'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Folder, FileText, CircleCheck, CircleX, CircleSlash, CircleDashed, Plus, FolderOpen } from 'lucide-react'
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
            toast.success('Spec created successfully')
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
                            <div className="rounded-xl border bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800 p-3">
                                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                    <Folder className="size-4" />
                                    <span className="text-xs font-medium">Subfolders</span>
                                </div>
                                <p className="mt-1 text-2xl font-semibold text-blue-700 dark:text-blue-300">
                                    {stats.subfolders}
                                </p>
                            </div>
                            <div className="rounded-xl border bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800 p-3">
                                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                                    <FileText className="size-4" />
                                    <span className="text-xs font-medium">Test Specs</span>
                                </div>
                                <p className="mt-1 text-2xl font-semibold text-purple-700 dark:text-purple-300">
                                    {stats.specs}
                                </p>
                            </div>
                            <div className="rounded-xl border bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800 p-3">
                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                    <CircleCheck className="size-4" />
                                    <span className="text-xs font-medium">Passed</span>
                                </div>
                                <p className="mt-1 text-2xl font-semibold text-green-700 dark:text-green-300">
                                    {stats.passed}
                                </p>
                            </div>
                            <div className="rounded-xl border bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 border-red-200 dark:border-red-800 p-3">
                                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                    <CircleX className="size-4" />
                                    <span className="text-xs font-medium">Failed</span>
                                </div>
                                <p className="mt-1 text-2xl font-semibold text-red-700 dark:text-red-300">
                                    {stats.failed}
                                </p>
                            </div>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                            <div className="rounded-xl border bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20 border-amber-200 dark:border-amber-800 p-3">
                                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                                    <CircleSlash className="size-4" />
                                    <span className="text-xs font-medium">Skipped</span>
                                </div>
                                <p className="mt-1 text-2xl font-semibold text-amber-700 dark:text-amber-300">
                                    {stats.skipped}
                                </p>
                            </div>
                            <div className="rounded-xl border bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950/20 dark:to-gray-900/20 border-gray-200 dark:border-gray-800 p-3">
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <CircleDashed className="size-4" />
                                    <span className="text-xs font-medium">Pending</span>
                                </div>
                                <p className="mt-1 text-2xl font-semibold text-gray-700 dark:text-gray-300">
                                    {stats.pending}
                                </p>
                            </div>
                        </div>
                    </div>

                    {folderSpecs.length > 0 ? (
                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="font-medium text-sm sm:text-base">Test Specs</h3>
                                <Button
                                    onClick={() => setCreateSpecDialogOpen(true)}
                                    size="sm"
                                    variant="default"
                                    className="gap-2"
                                >
                                    <Plus className="size-4" />
                                    New Spec
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {folderSpecs.map((spec) => (
                                    <div
                                        key={spec.id}
                                        className="group flex items-center justify-between rounded-xl border bg-card p-4 cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-all duration-200 hover:shadow-md"
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
                                                <FileText className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                <span className="font-medium">{spec.name}</span>
                                            </div>
                                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                <span>{spec.fileName || 'No file'}</span>
                                                <span className="text-muted-foreground/50">•</span>
                                                <span>{spec.numberOfTests} tests</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-1">
                                            {Object.entries(spec.statuses)
                                                .filter(([, count]) => count > 0)
                                                .map(([status, count]) => {
                                                    const config = STATUS_CONFIGS[status as keyof typeof STATUS_CONFIGS]
                                                    return (
                                                        <Badge
                                                            key={status}
                                                            variant="outline"
                                                            className={config.badgeClassName}
                                                        >
                                                            {count} {config.label}
                                                        </Badge>
                                                    )
                                                })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed bg-muted/30 p-6">
                            <div className="flex flex-col items-center justify-center gap-3 text-center">
                                <div className="rounded-full bg-muted-foreground/10 p-3">
                                    <FileText className="size-8 text-muted-foreground/50" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">No test specs yet</p>
                                    <p className="text-xs text-muted-foreground">
                                        Create your first test spec to get started
                                    </p>
                                </div>
                                <Button
                                    onClick={() => setCreateSpecDialogOpen(true)}
                                    size="sm"
                                    variant="default"
                                    className="gap-2"
                                >
                                    <Plus className="size-4" />
                                    New Spec
                                </Button>
                            </div>
                        </div>
                    )}

                    {subfolders.length > 0 ? (
                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="font-medium text-sm sm:text-base">Subfolders</h3>
                                <Button
                                    onClick={() => setCreateFolderDialogOpen(true)}
                                    size="sm"
                                    variant="outline"
                                    className="gap-2"
                                >
                                    <Plus className="size-4" />
                                    New Folder
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {subfolders.map((folder) => (
                                    <div
                                        key={folder.id}
                                        className="group flex items-center justify-between rounded-xl border bg-card p-4 cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-all duration-200 hover:shadow-md"
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
                                        <div className="flex items-center gap-3">
                                            <FolderOpen className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                            <div className="flex-1">
                                                <span className="font-medium">{folder.name}</span>
                                                {folder.description && (
                                                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                                        {folder.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed bg-muted/30 p-6">
                            <div className="flex flex-col items-center justify-center gap-3 text-center">
                                <div className="rounded-full bg-muted-foreground/10 p-3">
                                    <FolderOpen className="size-8 text-muted-foreground/50" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">No subfolders yet</p>
                                    <p className="text-xs text-muted-foreground">
                                        Create subfolders to organize your test specs
                                    </p>
                                </div>
                                <Button
                                    onClick={() => setCreateFolderDialogOpen(true)}
                                    size="sm"
                                    variant="outline"
                                    className="gap-2"
                                >
                                    <Plus className="size-4" />
                                    New Folder
                                </Button>
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
