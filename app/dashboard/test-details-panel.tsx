'use client'

import { Edit, FileText, Trash2, Check, Copy, Plus, Folder } from 'lucide-react'
import { useState } from 'react'
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { DEFAULT_SPEC_STATUSES } from '@/db/schema'
import { SPEC_STATUSES, STATUS_CONFIGS, TEST_STATUSES } from '@/lib/constants'
import { safeClient } from '@/lib/orpc/orpc'
import { authClient } from '@/lib/shared/better-auth'
import { TestSpec, Test, TestRequirement, type TestStatus } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { invalidateAndRefetchQueries } from './hooks'

interface TestDetailsPanelProps {
    selectedSpec: TestSpec | null
    selectedRequirements: TestRequirement[]
    selectedTests: Test[]
    onEditSpec: (spec: TestSpec) => void
    onCreateGroup: () => void
    onCreateTest: () => void
    onDeleteSpec?: (specId: string) => void
}

export function TestDetailsPanel({
    selectedSpec,
    selectedRequirements,
    selectedTests,
    onEditSpec,
    onCreateGroup,
    onCreateTest,
    onDeleteSpec
}: TestDetailsPanelProps) {
    const [copied, setCopied] = useState(false)
    const [editingRequirements, setEditingRequirements] = useState(false)
    const [, setRequirementsContent] = useState('')
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

    const copyTestCode = async () => {
        if (selectedSpec) {
            const testCode = generateTestCode(selectedSpec, requirementsToShow, selectedTests)
            await navigator.clipboard.writeText(testCode)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

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

    const requirementsToShow: TestRequirement[] = selectedRequirements

    const saveRequirements = () => {
        // In real app, would save to database
        if (selectedSpec) {
            // This would update the requirements in the database
            // For now, we'll just close the editing mode
            // console.log('Saving requirements:', requirementsContent)
        }
        setEditingRequirements(false)
    }

    if (!selectedSpec) {
        return (
            <div className="flex flex-1 items-center justify-center text-muted-foreground">
                <div className="text-center">
                    <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
                    <p>Select a spec to view details and requirements</p>
                    <div className="mt-4 flex justify-around">
                        <Button
                            variant="outline"
                            onClick={() => createFolderMutation.mutate()}
                            disabled={createFolderMutation.isPending}
                        >
                            <Folder className="mr-2 h-4 w-4" />
                            New Folder
                        </Button>
                        <Button
                            onClick={() => createTestSpecMutation.mutate()}
                            disabled={createTestSpecMutation.isPending}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            New Test
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="border-b p-4">
                <div className="mb-2 flex items-start justify-between">
                    <div>
                        <div className="mb-1 flex items-center gap-2">
                            <h2 className="font-semibold text-xl">{selectedSpec.name}</h2>
                            <Button onClick={() => onEditSpec(selectedSpec)} size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                            </Button>
                            {onDeleteSpec && (
                                <Button
                                    onClick={() => setDeleteSpecDialogOpen(true)}
                                    size="sm"
                                    variant="ghost"
                                    className="text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <p className="mb-2 text-muted-foreground text-sm">{selectedSpec.description}</p>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline">{selectedSpec.statuses[SPEC_STATUSES.deactivated]}</Badge>
                            <Badge variant="outline">{selectedSpec.fileName || 'No file'}</Badge>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
                <Tabs className="h-full" defaultValue="requirements">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="requirements">Functional Requirements</TabsTrigger>
                        <TabsTrigger value="vitest">Code</TabsTrigger>
                    </TabsList>

                    <TabsContent className="mt-4 space-y-4" value="requirements">
                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="font-medium">Test Requirements</h3>
                                <Button
                                    onClick={() => setEditingRequirements(!editingRequirements)}
                                    size="sm"
                                    variant="outline"
                                >
                                    <Edit className="mr-1 h-4 w-4" />
                                    {editingRequirements ? 'Cancel' : 'Edit'}
                                </Button>
                            </div>

                            {requirementsToShow.length > 0 && (
                                <div className="mb-4 rounded-lg bg-muted/30 p-3">
                                    <div className="flex items-center gap-4 text-sm">
                                        {Object.values(TEST_STATUSES).map((status) => {
                                            const count = selectedTests.filter(
                                                (test: Test) => test.status === status
                                            ).length

                                            if (count === 0) return null

                                            const statusConfig = STATUS_CONFIGS[status]
                                            const IconComponent = statusConfig.icon

                                            return (
                                                <div key={status} className="flex items-center gap-1">
                                                    <IconComponent className={`h-4 w-4 ${statusConfig.color}`} />
                                                    <span className="font-medium">
                                                        {count} {statusConfig.label}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {editingRequirements ? (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        {requirementsToShow.map((req: TestRequirement, index: number) => (
                                            <div
                                                key={req.id || index}
                                                className="flex items-center gap-2 rounded-lg border p-3"
                                            >
                                                <input
                                                    className="flex-1 bg-transparent outline-none"
                                                    onChange={(e) => {
                                                        const updatedReqs = [...requirementsToShow]
                                                        updatedReqs[index] = {
                                                            ...req,
                                                            name: e.target.value
                                                        } as TestRequirement
                                                        setRequirementsContent(
                                                            updatedReqs.map((r: TestRequirement) => r.name).join('\n')
                                                        )
                                                    }}
                                                    placeholder="Enter requirement..."
                                                    value={req.name || ''}
                                                />
                                                <Button
                                                    onClick={() => {
                                                        const updatedReqs = requirementsToShow.filter(
                                                            (_: any, i: number) => i !== index
                                                        )
                                                        setRequirementsContent(
                                                            updatedReqs.map((r: TestRequirement) => r.name).join('\n')
                                                        )
                                                    }}
                                                    size="sm"
                                                    variant="ghost"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            onClick={() => {
                                                const newReq: TestRequirement = {
                                                    id: `req-${Date.now()}`,
                                                    name: '',
                                                    description: null,
                                                    order: requirementsToShow.length,
                                                    specId: selectedSpec.id,
                                                    createdAt: new Date(),
                                                    updatedAt: new Date()
                                                }
                                                const updatedReqs = [...requirementsToShow, newReq]
                                                setRequirementsContent(
                                                    updatedReqs.map((r: TestRequirement) => r.name).join('\n')
                                                )
                                            }}
                                            size="sm"
                                            variant="outline"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Requirement
                                        </Button>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button onClick={() => setEditingRequirements(false)} variant="outline">
                                            Cancel
                                        </Button>
                                        <Button onClick={saveRequirements}>Save Requirements</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {requirementsToShow.map((req: TestRequirement, index: number) => {
                                        const config =
                                            STATUS_CONFIGS[
                                                (selectedTests.find((t) => t.requirementId === req.id)?.status ||
                                                    'pending') as TestStatus
                                            ]
                                        const IconComponent = config.icon
                                        const badge = (
                                            <Badge className={config.requirementClassName}>
                                                <IconComponent className="h-4 w-4 mr-1" />
                                                {config.label}
                                            </Badge>
                                        )
                                        const color = config.requirementClassName
                                        return (
                                            <div
                                                className={cn('flex items-start gap-3 rounded-lg border p-3', color)}
                                                key={req.id || index}
                                            >
                                                <div className="mt-0.5">{badge}</div>
                                                <div className="flex-1">
                                                    <span className="font-medium text-sm">{req.name}</span>
                                                    {req.description && (
                                                        <div className="mt-1 text-muted-foreground text-xs">
                                                            {req.description}
                                                        </div>
                                                    )}
                                                    <div className="mt-1 text-muted-foreground text-xs">
                                                        Status:{' '}
                                                        <span className="capitalize">
                                                            {selectedTests.find((t) => t.requirementId === req.id)
                                                                ?.status || 'pending'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {requirementsToShow.length === 0 && (
                                        <div className="text-muted-foreground text-sm">No requirements defined</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent className="mt-4" value="vitest">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">Generated Test Code</h3>
                                <Button onClick={copyTestCode} size="sm">
                                    {copied ? (
                                        <>
                                            <Check className="mr-1 h-4 w-4" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="mr-1 h-4 w-4" />
                                            Copy Test Code
                                        </>
                                    )}
                                </Button>
                            </div>
                            <div className="max-h-[500px] overflow-auto rounded-lg bg-slate-950 p-4 font-mono text-slate-50 text-sm">
                                <pre className="whitespace-pre-wrap">
                                    {generateTestCode(selectedSpec, requirementsToShow, selectedTests)}
                                </pre>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

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
                            onClick={() => {
                                if (selectedSpec && onDeleteSpec) {
                                    onDeleteSpec(selectedSpec.id)
                                    setDeleteSpecDialogOpen(false)
                                }
                            }}
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
