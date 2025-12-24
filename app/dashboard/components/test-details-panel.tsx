'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { DEFAULT_SPEC_STATUSES } from '@/db/schema'
import { safeClient } from '@/lib/orpc/orpc'
import { authClient } from '@/lib/shared/better-auth-client'
import { TestSpec, Test, TestRequirement } from '@/lib/types'

import { invalidateAndRefetchQueries } from '../hooks'
import { CreateFolderDialog } from './create-folder-dialog'
import { CreateSpecDialog } from './create-spec-dialog'
import { DeleteConfirmDialog } from './delete-confirm-dialog'
import { RequirementsTab } from './requirements-tab'
import { TestDetailsEmptyState } from './test-details-empty-state'
import { TestDetailsHeader } from './test-details-header'
import { VitestCodeTab } from './vitest-code-tab'

export interface TestDetailsPanelProps {
    selectedSpec: TestSpec | null
    selectedRequirements: TestRequirement[]
    selectedTests: Test[]
    onRenameSpec: (specId: string, name: string) => void
    onDeleteSpec: (specId: string) => void
    onRequirementsUpdated?: (requirements: TestRequirement[]) => void
    onRefreshTreeChildren?: (parentFolderId: string | null) => Promise<void> | void
}

export function TestDetailsPanel({
    selectedSpec,
    selectedRequirements,
    selectedTests,
    onRenameSpec,
    onDeleteSpec,
    onRequirementsUpdated,
    onRefreshTreeChildren
}: TestDetailsPanelProps) {
    const [deleteSpecDialogOpen, setDeleteSpecDialogOpen] = useState(false)
    const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false)
    const [createSpecDialogOpen, setCreateSpecDialogOpen] = useState(false)
    const { data: activeOrganization } = authClient.useActiveOrganization()
    const queryClient = useQueryClient()

    const createFolderMutation = useMutation({
        mutationFn: async (name: string) => {
            if (!activeOrganization?.id) {
                throw new Error('No active organization')
            }
            const { data, error } = await safeClient.testFolders.upsert({
                id: crypto.randomUUID(),
                name,
                organizationId: activeOrganization.id,
                order: 0
            })
            if (error) throw error
            return data
        },
        onSuccess: async () => {
            await invalidateAndRefetchQueries(queryClient, '/test-folders')
            await onRefreshTreeChildren?.(null)
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
                folderId: null,
                organizationId: activeOrganization.id,
                statuses: DEFAULT_SPEC_STATUSES,
                numberOfTests: 0
            })
            if (error) throw error
            return data
        },
        onSuccess: async () => {
            await invalidateAndRefetchQueries(queryClient, '/test-specs')
            await onRefreshTreeChildren?.(null)
            toast.success('Spec created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create test')
        }
    })

    const generateTestCode = (spec: TestSpec, reqs: TestRequirement[], tests: Test[]): string => {
        const requirements = reqs
            .map((req) => {
                const testStatus = tests.find((t) => t.requirementId === req.id)?.status
                const testCode =
                    tests.find((t) => t.requirementId === req.id)?.code || `// TODO: Implement test for ${req.name}`
                return `  it('${req.name}', () => {
    // ${req.description || 'No description'}
    // Status: ${testStatus}
    ${testCode}
  })`
            })
            .join('\n\n')

        return `describe('${spec.name}', () => {
  // ${spec.description || 'No description'}
  // Total requirements: ${reqs.length}
  // Passed tests: ${tests.filter((t) => t.status === 'passed').length}

${requirements}
})`
    }

    const saveRequirementsMutation = useMutation({
        mutationFn: async (variables: { requirements: TestRequirement[]; deletedIds: string[] }) => {
            const { requirements, deletedIds } = variables

            const deletePromises = deletedIds.map(async (id) => safeClient.testRequirements.delete({ id }))

            const updatePromises = requirements.map(async (req) =>
                safeClient.testRequirements.upsert({
                    id: req.id,
                    name: req.name,
                    description: req.description,
                    specId: req.specId,
                    order: req.order
                })
            )

            const allResults = await Promise.all([...deletePromises, ...updatePromises])
            const errors = allResults.filter((r) => r.error)
            if (errors.length > 0) {
                throw new Error('Failed to save some requirements')
            }
            return allResults.map((r) => r.data)
        },
        onSuccess: async () => {
            await invalidateAndRefetchQueries(queryClient, '/test-requirements')
            toast.success('Requirements saved successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to save requirements')
        }
    })

    const handleSaveRequirements = (requirements: TestRequirement[], deletedIds: string[]) => {
        saveRequirementsMutation.mutate({ requirements, deletedIds })
    }

    if (!selectedSpec) {
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
            <TestDetailsHeader
                spec={selectedSpec}
                onRename={(name) => onRenameSpec(selectedSpec.id, name)}
                onDelete={() => setDeleteSpecDialogOpen(true)}
            />

            <div className="flex-1 overflow-auto p-3 sm:p-4">
                <Tabs className="h-full" defaultValue="requirements">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="requirements" className="text-xs sm:text-sm">
                            Functional Requirements
                        </TabsTrigger>
                        <TabsTrigger value="vitest" className="text-xs sm:text-sm">
                            Code
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent className="mt-4 space-y-4" value="requirements">
                        <RequirementsTab
                            requirements={selectedRequirements}
                            tests={selectedTests}
                            specId={selectedSpec.id}
                            onSaveRequirements={handleSaveRequirements}
                            onRequirementsUpdated={onRequirementsUpdated}
                        />
                    </TabsContent>

                    <TabsContent className="mt-4" value="vitest">
                        <VitestCodeTab
                            spec={selectedSpec}
                            requirements={selectedRequirements}
                            tests={selectedTests}
                            generateTestCode={generateTestCode}
                        />
                    </TabsContent>
                </Tabs>
            </div>

            <DeleteConfirmDialog
                open={deleteSpecDialogOpen}
                onOpenChange={setDeleteSpecDialogOpen}
                title="Delete Test Spec"
                description="Are you sure you want to delete this test spec? This action cannot be undone."
                onConfirm={() => {
                    if (selectedSpec && onDeleteSpec) {
                        onDeleteSpec(selectedSpec.id)
                        setDeleteSpecDialogOpen(false)
                    }
                }}
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
