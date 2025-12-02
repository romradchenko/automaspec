'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { DEFAULT_SPEC_STATUSES } from '@/db/schema'
import { safeClient } from '@/lib/orpc/orpc'
import { authClient } from '@/lib/shared/better-auth-client'
import { TestSpec, Test, TestRequirement } from '@/lib/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { DeleteConfirmDialog } from './components/delete-confirm-dialog'
import { RequirementsTab } from './components/requirements-tab'
import { TestDetailsEmptyState } from './components/test-details-empty-state'
import { TestDetailsHeader } from './components/test-details-header'
import { VitestCodeTab } from './components/vitest-code-tab'
import { invalidateAndRefetchQueries } from './hooks'

interface TestDetailsPanelProps {
    selectedSpec: TestSpec | null
    selectedRequirements: TestRequirement[]
    selectedTests: Test[]
    onEditSpec: (spec: TestSpec) => void
    onCreateGroup: () => void
    onCreateTest: () => void
    onDeleteSpec?: (specId: string) => void
    onConfirmDeleteSpec: (specId: string) => void
}

export function TestDetailsPanel({
    selectedSpec,
    selectedRequirements,
    selectedTests,
    onEditSpec,
    onCreateGroup,
    onCreateTest,
    onDeleteSpec,
    onConfirmDeleteSpec
}: TestDetailsPanelProps) {
    const [deleteSpecDialogOpen, setDeleteSpecDialogOpen] = useState(false)
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
            toast.success('Folder created successfully')
            onCreateGroup?.()
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
                name: 'New Test',
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
            toast.success('Test created successfully')
            onCreateTest?.()
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

    const handleSaveRequirements = (_requirements: TestRequirement[]) => {
        return undefined
    }

    if (!selectedSpec) {
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
            <TestDetailsHeader
                spec={selectedSpec}
                onEdit={onEditSpec}
                onDelete={onDeleteSpec ? () => setDeleteSpecDialogOpen(true) : undefined}
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
                    if (selectedSpec) {
                        onConfirmDeleteSpec(selectedSpec.id)
                        setDeleteSpecDialogOpen(false)
                    }
                }}
            />
        </>
    )
}
