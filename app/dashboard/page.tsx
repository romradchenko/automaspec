'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import type { TestSpec, Test, TestRequirement } from '@/lib/types'

import { DEFAULT_SPEC_STATUSES } from '@/db/schema'
import { safeClient } from '@/lib/orpc/orpc'
import { orpc } from '@/lib/orpc/orpc'
import { authClient } from '@/lib/shared/better-auth-client'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'

import { DeleteConfirmDialog } from './components/delete-confirm-dialog'
import { DashboardHeader } from './header'
import { invalidateAndRefetchQueries } from './hooks'
import { TestDetailsPanel } from './test-details-panel'
import { Tree } from './tree'

export default function Dashboard() {
    const [selectedSpec, setSelectedSpec] = useState<TestSpec | null>(null)
    const [selectedRequirements, setSelectedRequirements] = useState<TestRequirement[]>([])
    const [selectedTests, setSelectedTests] = useState<Test[]>([])
    const [deleteDialog, setDeleteDialog] = useState<{ type: 'folder' | 'spec'; id: string } | null>(null)

    const { data: requirements = [] } = useQuery(
        orpc.testRequirements.list.queryOptions({
            input: {}
        })
    )
    const { data: tests = [] } = useQuery(
        orpc.tests.list.queryOptions({
            input: {}
        })
    )
    const { data: activeOrganization } = authClient.useActiveOrganization()
    const queryClient = useQueryClient()

    const createTestSpecMutation = useMutation({
        mutationFn: async (folderId: string) => {
            if (!activeOrganization?.id) {
                throw new Error('No active organization')
            }
            const { data, error } = await safeClient.testSpecs.upsert({
                id: crypto.randomUUID(),
                name: 'New Test',
                folderId,
                organizationId: activeOrganization.id,
                statuses: DEFAULT_SPEC_STATUSES,
                numberOfTests: 0
            })
            if (error) throw error
            return data
        },
        onSuccess: async () => {
            await invalidateAndRefetchQueries(queryClient, '/test-specs')
            toast.success('Test created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create test')
        }
    })

    const handleSpecSelect = (spec: TestSpec) => {
        const specRequirements = requirements.filter((req) => req.specId === spec.id)
        const specTests = tests.filter((test) => test.requirementId === spec.id)

        setSelectedSpec(spec)
        setSelectedRequirements(specRequirements)
        setSelectedTests(specTests)
    }

    const handleCreateTest = (folderId: string) => {
        createTestSpecMutation.mutate(folderId)
    }

    const deleteFolderMutation = useMutation({
        mutationFn: async (folderId: string) => {
            const { data, error } = await safeClient.testFolders.delete({ id: folderId })
            if (error) throw error
            return data
        },
        onSuccess: async () => {
            await invalidateAndRefetchQueries(queryClient, '/test-folders')
            toast.success('Folder deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete folder')
        }
    })

    const deleteSpecMutation = useMutation({
        mutationFn: async (specId: string) => {
            const { data, error } = await safeClient.testSpecs.delete({ id: specId })
            if (error) throw error
            return data
        },
        onSuccess: async () => {
            if (selectedSpec?.id) {
                setSelectedSpec(null)
                setSelectedRequirements([])
                setSelectedTests([])
            }
            await invalidateAndRefetchQueries(queryClient, '/test-specs')
            toast.success('Test deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete test')
        }
    })

    const handleDeleteFolder = (folderId: string) => {
        setDeleteDialog({ type: 'folder', id: folderId })
    }

    const handleDeleteSpec = (specId: string) => {
        setDeleteDialog({ type: 'spec', id: specId })
    }

    const handleConfirmDelete = () => {
        if (!deleteDialog) return

        if (deleteDialog.type === 'folder') {
            deleteFolderMutation.mutate(deleteDialog.id)
        } else {
            deleteSpecMutation.mutate(deleteDialog.id)
        }
        setDeleteDialog(null)
    }

    return (
        <>
            <div className="flex h-screen flex-col bg-background lg:flex-row">
                <div className="flex flex-col border-b lg:w-1/2 lg:border-b-0 lg:border-r">
                    <DashboardHeader />

                    <div className="flex-1 overflow-auto p-3 sm:p-2">
                        <Tree
                            selectedSpecId={selectedSpec?.id || null}
                            onSelectSpec={handleSpecSelect}
                            onCreateTest={handleCreateTest}
                            onDeleteFolder={handleDeleteFolder}
                            onDeleteSpec={handleDeleteSpec}
                        />
                    </div>
                </div>

                <div className="flex flex-col lg:w-1/2">
                    <TestDetailsPanel
                        selectedSpec={selectedSpec}
                        selectedRequirements={selectedRequirements}
                        selectedTests={selectedTests}
                        onEditSpec={() => {
                            // TODO: Implement edit spec
                        }}
                        onCreateGroup={() => {
                            // TODO: Implement create group
                        }}
                        onCreateTest={() => {
                            // TODO: Implement create test
                        }}
                        onDeleteSpec={handleDeleteSpec}
                        onConfirmDeleteSpec={(specId: string) => {
                            deleteSpecMutation.mutate(specId)
                        }}
                    />
                </div>
            </div>

            {deleteDialog && (
                <DeleteConfirmDialog
                    open={true}
                    onOpenChange={(open) => {
                        if (!open) {
                            setDeleteDialog(null)
                        }
                    }}
                    title={deleteDialog.type === 'folder' ? 'Delete Folder' : 'Delete Test Spec'}
                    description={
                        deleteDialog.type === 'folder'
                            ? 'Are you sure you want to delete this folder? This will also delete all folders and tests inside it. This action cannot be undone.'
                            : 'Are you sure you want to delete this test spec? This action cannot be undone.'
                    }
                    onConfirm={handleConfirmDelete}
                />
            )}
        </>
    )
}
