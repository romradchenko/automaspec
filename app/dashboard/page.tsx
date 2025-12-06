'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import type { TestSpec, Test, TestRequirement, TestFolder } from '@/lib/types'

import { DEFAULT_SPEC_STATUSES } from '@/db/schema'
import { orpc, safeClient } from '@/lib/orpc/orpc'
import { authClient } from '@/lib/shared/better-auth-client'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'

import { DeleteConfirmDialog } from './components/delete-confirm-dialog'
import { FolderDetailsPanel } from './components/folder-details-panel'
import { DashboardHeader } from './components/header'
import { TestDetailsPanel } from './components/test-details-panel'
import { invalidateAndRefetchQueries } from './hooks'
import { Tree } from './tree'

export default function Dashboard() {
    const [selectedSpec, setSelectedSpec] = useState<TestSpec | null>(null)
    const [selectedFolder, setSelectedFolder] = useState<TestFolder | null>(null)
    const [selectedRequirements, setSelectedRequirements] = useState<TestRequirement[]>([])
    const [selectedTests, setSelectedTests] = useState<Test[]>([])
    const [deleteDialog, setDeleteDialog] = useState<{ type: 'folder' | 'spec'; id: string } | null>(null)
    const router = useRouter()

    const { data: activeOrganization, isPending: isPendingActiveOrg } = authClient.useActiveOrganization()
    const { data: organizations, isPending: isPendingOrganizations } = authClient.useListOrganizations()
    const queryClient = useQueryClient()

    useEffect(() => {
        if (isPendingActiveOrg || isPendingOrganizations) return

        if (!activeOrganization) {
            if (organizations && organizations.length > 0) {
                router.push('/choose-organization')
            } else {
                router.push('/create-organization')
            }
        }
    }, [activeOrganization, organizations, isPendingActiveOrg, isPendingOrganizations, router])

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
        setSelectedFolder(null)
        setSelectedRequirements(specRequirements)
        setSelectedTests(specTests)
    }

    const handleFolderSelect = async (folderId: string) => {
        const { data: folder, error } = await safeClient.testFolders.get({ id: folderId })
        if (error) {
            toast.error(error.message || 'Failed to load folder')
            return
        }
        if (folder) {
            setSelectedFolder(folder)
            setSelectedSpec(null)
            setSelectedRequirements([])
            setSelectedTests([])
        }
    }

    const deleteFolderMutation = useMutation({
        mutationFn: async (folderId: string) => {
            const { data, error } = await safeClient.testFolders.delete({ id: folderId })
            if (error) throw error
            return data
        },
        onSuccess: async () => {
            if (selectedFolder?.id) {
                setSelectedFolder(null)
            }
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
        deleteFolderMutation.mutate(folderId)
    }

    const handleDeleteSpec = (specId: string) => {
        deleteSpecMutation.mutate(specId)
    }

    const handleDeleteFolderFromTree = (folderId: string) => {
        setDeleteDialog({ type: 'folder', id: folderId })
    }

    const handleDeleteSpecFromTree = (specId: string) => {
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

    if (isPendingActiveOrg || isPendingOrganizations || !activeOrganization) {
        return null
    }

    return (
        <>
            <div className="flex h-screen flex-col bg-background lg:flex-row">
                <div className="flex flex-col border-b lg:w-1/2 lg:border-b-0 lg:border-r">
                    <DashboardHeader />

                    <div className="flex-1 overflow-auto p-3 sm:p-2">
                        <Tree
                            selectedSpecId={selectedSpec?.id || null}
                            selectedFolderId={selectedFolder?.id || null}
                            onSelectSpec={handleSpecSelect}
                            onSelectFolder={handleFolderSelect}
                            onCreateTest={createTestSpecMutation.mutate}
                            onDeleteFolder={handleDeleteFolderFromTree}
                            onDeleteSpec={handleDeleteSpecFromTree}
                        />
                    </div>
                </div>

                <div className="flex flex-col lg:w-1/2">
                    {selectedFolder ? (
                        <FolderDetailsPanel selectedFolder={selectedFolder} onDeleteFolder={handleDeleteFolder} />
                    ) : (
                        <TestDetailsPanel
                            selectedSpec={selectedSpec}
                            selectedRequirements={selectedRequirements}
                            selectedTests={selectedTests}
                            onDeleteSpec={handleDeleteSpec}
                        />
                    )}
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
