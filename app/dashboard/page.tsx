'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { type TestSpec, type Test, type TestRequirement } from '@/lib/types'
import { DashboardHeader } from './header'
import { Tree } from './tree'
import { TestDetailsPanel } from './test-details-panel'
import { useFolders, useSpecs, useRequirements, useTests, invalidateAndRefetchQueries } from './hooks'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from '@/lib/orpc/orpc'
import { authClient } from '@/lib/shared/better-auth'
import { toast } from 'sonner'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { DEFAULT_SPEC_STATUSES } from '@/db/schema'

export default function Dashboard() {
    const [selectedSpec, setSelectedSpec] = useState<TestSpec | null>(null)
    const [selectedRequirements, setSelectedRequirements] = useState<TestRequirement[]>([])
    const [selectedTests, setSelectedTests] = useState<Test[]>([])
    const [deleteFolderDialogOpen, setDeleteFolderDialogOpen] = useState(false)
    const [deleteSpecDialogOpen, setDeleteSpecDialogOpen] = useState(false)
    const [folderToDelete, setFolderToDelete] = useState<string | null>(null)
    const [specToDelete, setSpecToDelete] = useState<string | null>(null)

    const { folders, foldersLoading } = useFolders(null)
    const { specs, specsLoading } = useSpecs(null)
    const { requirements, requirementsLoading } = useRequirements('')
    const { tests, testsLoading } = useTests('')
    const { data: activeOrganization } = authClient.useActiveOrganization()
    const queryClient = useQueryClient()

    const loading = foldersLoading || specsLoading || requirementsLoading || testsLoading

    const createTestSpecMutation = useMutation({
        mutationFn: async (folderId: string) => {
            if (!activeOrganization?.id) {
                throw new Error('No active organization')
            }
            return await client.testSpecs.upsert({
                id: crypto.randomUUID(),
                name: 'New Test',
                folderId,
                organizationId: activeOrganization.id,
                statuses: DEFAULT_SPEC_STATUSES,
                numberOfTests: 0
            })
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
            return await client.testFolders.delete({ id: folderId })
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
            return await client.testSpecs.delete({ id: specId })
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
        setFolderToDelete(folderId)
        setDeleteFolderDialogOpen(true)
    }

    const handleDeleteSpec = (specId: string) => {
        setSpecToDelete(specId)
        setDeleteSpecDialogOpen(true)
    }

    const confirmDeleteFolder = () => {
        if (folderToDelete) {
            deleteFolderMutation.mutate(folderToDelete)
            setDeleteFolderDialogOpen(false)
            setFolderToDelete(null)
        }
    }

    const confirmDeleteSpec = () => {
        if (specToDelete) {
            deleteSpecMutation.mutate(specToDelete)
            setDeleteSpecDialogOpen(false)
            setSpecToDelete(null)
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="flex items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="flex h-screen bg-background">
                <div className="flex w-1/2 flex-col border-r">
                    <DashboardHeader />

                    <div className="flex-1 overflow-auto p-2">
                        <Tree
                            folders={folders}
                            specs={specs}
                            requirements={requirements}
                            tests={tests}
                            selectedSpecId={selectedSpec?.id || null}
                            onSelectSpec={handleSpecSelect}
                            onCreateTest={handleCreateTest}
                            onDeleteFolder={handleDeleteFolder}
                            onDeleteSpec={handleDeleteSpec}
                        />
                    </div>
                </div>

                <div className="flex w-1/2 flex-col">
                    <TestDetailsPanel
                        selectedSpec={selectedSpec}
                        selectedRequirements={selectedRequirements}
                        selectedTests={selectedTests}
                        onEditSpec={() => {}}
                        onCreateGroup={() => {}}
                        onCreateTest={() => {}}
                        onDeleteSpec={handleDeleteSpec}
                    />
                </div>
            </div>

            <AlertDialog open={deleteFolderDialogOpen} onOpenChange={setDeleteFolderDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Folder</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this folder? This will also delete all folders and tests
                            inside it. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDeleteFolder}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={deleteSpecDialogOpen} onOpenChange={setDeleteSpecDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Test Spec</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this test spec? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDeleteSpec}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
