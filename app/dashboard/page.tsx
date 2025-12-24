'use client'

import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { toast } from 'sonner'

import type {
    AiChatMessage,
    AiProvider,
    TestSpec,
    Test,
    TestRequirement,
    TestFolder,
    AiChatResponse
} from '@/lib/types'

import { DEFAULT_SPEC_STATUSES } from '@/db/schema'
import { AI_MODELS, AI_PROVIDERS } from '@/lib/constants'
import { orpc, safeClient } from '@/lib/orpc/orpc'
import { authClient } from '@/lib/shared/better-auth-client'

import { AiChatWidget } from './components/ai-chat-widget'
import { CreateSpecDialog } from './components/create-spec-dialog'
import { DeleteConfirmDialog } from './components/delete-confirm-dialog'
import { FolderDetailsPanel } from './components/folder-details-panel'
import { DashboardHeader } from './components/header'
import { TestDetailsPanel } from './components/test-details-panel'
import { invalidateAndRefetchQueries } from './hooks'
import { Tree, type TreeHandle } from './tree'

export default function Dashboard() {
    const [selectedSpec, setSelectedSpec] = useState<TestSpec | null>(null)
    const [selectedFolder, setSelectedFolder] = useState<TestFolder | null>(null)
    const [selectedRequirements, setSelectedRequirements] = useState<TestRequirement[]>([])
    const [selectedTests, setSelectedTests] = useState<Test[]>([])
    const [deleteDialog, setDeleteDialog] = useState<{
        type: 'folder' | 'spec'
        id: string
        parentFolderId: string | null
    } | null>(null)
    const [aiOpen, setAiOpen] = useState(false)
    const [aiMessages, setAiMessages] = useState<AiChatMessage[]>([])
    const [aiInput, setAiInput] = useState('')
    const [aiProvider, setAiProvider] = useState<AiProvider>(AI_PROVIDERS.google)
    const [aiModel, setAiModel] = useState<string>(AI_MODELS[AI_PROVIDERS.google])
    const [aiIsLoading, setAiIsLoading] = useState(false)
    const [aiError, setAiError] = useState<string | null>(null)
    const [aiProgress, setAiProgress] = useState<string[]>([])
    const router = useRouter()

    const { data: activeOrganization, isPending: isPendingActiveOrg } = authClient.useActiveOrganization()
    const { data: organizations, isPending: isPendingOrganizations } = authClient.useListOrganizations()
    const queryClient = useQueryClient()
    const treeRef = useRef<TreeHandle | null>(null)

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

    useEffect(() => {
        if (!aiOpen) {
            return
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setAiOpen(false)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [aiOpen])

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

    const handleSpecSelect = (spec: TestSpec) => {
        const specRequirements = []
        for (const requirement of requirements) {
            if (requirement.specId === spec.id) {
                specRequirements.push(requirement)
            }
        }

        const requirementIds = new Set<string>()
        for (const requirement of specRequirements) {
            requirementIds.add(requirement.id)
        }

        const specTests = []
        for (const test of tests) {
            if (requirementIds.has(test.requirementId)) {
                specTests.push(test)
            }
        }

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
        mutationFn: async (variables: { folderId: string; parentFolderId: string | null }) => {
            const { data, error } = await safeClient.testFolders.delete({ id: variables.folderId })
            if (error) throw error
            return { data, parentFolderId: variables.parentFolderId }
        },
        onSuccess: async (result) => {
            if (selectedFolder?.id) {
                setSelectedFolder(null)
            }
            await invalidateAndRefetchQueries(queryClient, '/test-folders')
            await treeRef.current?.refreshItemChildren(result.parentFolderId ?? 'root')
            toast.success('Folder deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete folder')
        }
    })

    const renameFolderMutation = useMutation({
        mutationFn: async (variables: { folderId: string; name: string }) => {
            const { data: folder, error } = await safeClient.testFolders.get({ id: variables.folderId })
            if (error) throw error
            const { data, error: upsertError } = await safeClient.testFolders.upsert({
                id: folder.id,
                name: variables.name,
                description: folder.description,
                parentFolderId: folder.parentFolderId,
                organizationId: folder.organizationId,
                order: folder.order
            })
            if (upsertError) throw upsertError
            return { data, parentFolderId: folder.parentFolderId }
        },
        onSuccess: async (result, variables) => {
            if (selectedFolder?.id === variables.folderId) {
                setSelectedFolder({ ...selectedFolder, name: variables.name })
            }
            await invalidateAndRefetchQueries(queryClient, '/test-folders')
            await treeRef.current?.refreshItemChildren(result.parentFolderId ?? 'root')
            toast.success('Folder renamed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to rename folder')
        }
    })

    const renameSpecMutation = useMutation({
        mutationFn: async (variables: { specId: string; name: string }) => {
            const { data: spec, error } = await safeClient.testSpecs.get({ id: variables.specId })
            if (error) throw error
            if (!spec) throw new Error('Spec not found')
            const { data, error: upsertError } = await safeClient.testSpecs.upsert({
                id: spec.id,
                name: variables.name,
                fileName: spec.fileName,
                description: spec.description,
                folderId: spec.folderId,
                organizationId: spec.organizationId,
                statuses: spec.statuses,
                numberOfTests: spec.numberOfTests
            })
            if (upsertError) throw upsertError
            return { data, parentFolderId: spec.folderId }
        },
        onSuccess: async (result, variables) => {
            if (selectedSpec?.id === variables.specId) {
                setSelectedSpec({ ...selectedSpec, name: variables.name })
            }
            await invalidateAndRefetchQueries(queryClient, '/test-specs')
            await treeRef.current?.refreshItemChildren(result.parentFolderId ?? 'root')
            toast.success('Spec renamed successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to rename spec')
        }
    })

    const deleteSpecMutation = useMutation({
        mutationFn: async (variables: { specId: string; parentFolderId: string | null }) => {
            const { data, error } = await safeClient.testSpecs.delete({ id: variables.specId })
            if (error) throw error
            return { data, parentFolderId: variables.parentFolderId }
        },
        onSuccess: async (result) => {
            if (selectedSpec?.id) {
                setSelectedSpec(null)
                setSelectedRequirements([])
                setSelectedTests([])
            }
            await invalidateAndRefetchQueries(queryClient, '/test-specs')
            await treeRef.current?.refreshItemChildren(result.parentFolderId ?? 'root')
            toast.success('Spec deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete spec')
        }
    })

    const aiMessageItems = useMemo(() => {
        const items: Array<{ role: AiChatMessage['role']; content: string; key: string }> = []
        for (let index = 0; index < aiMessages.length; index += 1) {
            const message = aiMessages[index]
            items.push({
                role: message.role,
                content: message.content,
                key: `${message.role}-${index}`
            })
        }
        return items
    }, [aiMessages])

    const handleDeleteFolder = (
        folderId: string,
        parentFolderId: string | null = selectedFolder?.parentFolderId ?? null
    ) => {
        deleteFolderMutation.mutate({ folderId, parentFolderId })
    }

    const handleDeleteSpec = (specId: string, parentFolderId: string | null = selectedSpec?.folderId ?? null) => {
        deleteSpecMutation.mutate({ specId, parentFolderId })
    }

    const handleDeleteFolderFromTree = (folderId: string, parentFolderId: string | null) => {
        setDeleteDialog({ type: 'folder', id: folderId, parentFolderId })
    }

    const handleDeleteSpecFromTree = (specId: string, parentFolderId: string | null) => {
        setDeleteDialog({ type: 'spec', id: specId, parentFolderId })
    }

    const [createSpecDialogOpen, setCreateSpecDialogOpen] = useState(false)
    const [createSpecFolderId, setCreateSpecFolderId] = useState<string | null>(null)

    const handleCreateTest = (folderId: string) => {
        setCreateSpecFolderId(folderId)
        setCreateSpecDialogOpen(true)
    }

    const createTestFromTreeMutation = useMutation({
        mutationFn: async (variables: { name: string; folderId: string }) => {
            if (!activeOrganization?.id) {
                throw new Error('No active organization')
            }
            const { data, error } = await safeClient.testSpecs.upsert({
                id: crypto.randomUUID(),
                name: variables.name,
                folderId: variables.folderId === 'root' ? null : variables.folderId,
                organizationId: activeOrganization.id,
                statuses: DEFAULT_SPEC_STATUSES,
                numberOfTests: 0
            })
            if (error) throw error
            return data
        },
        onSuccess: async (_, variables) => {
            await invalidateAndRefetchQueries(queryClient, '/test-specs')
            await treeRef.current?.refreshItemChildren(variables.folderId ?? 'root')
            toast.success('Test created successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create test')
        }
    })

    const handleRenameFolder = (folderId: string, name: string) => {
        renameFolderMutation.mutate({ folderId, name })
    }

    const handleRenameSpec = (specId: string, name: string) => {
        renameSpecMutation.mutate({ specId, name })
    }

    const handleDeleteFolderFromPanel = (folderId: string) => {
        handleDeleteFolder(folderId)
    }

    const handleDeleteSpecFromPanel = (specId: string) => {
        handleDeleteSpec(specId)
    }

    const handleEmptySpaceClick = () => {
        setSelectedFolder(null)
        setSelectedSpec(null)
    }

    const handleRequirementsUpdated = (updatedRequirements: TestRequirement[]) => {
        setSelectedRequirements(updatedRequirements)
    }

    const handleConfirmDelete = () => {
        if (!deleteDialog) return

        if (deleteDialog.type === 'folder') {
            deleteFolderMutation.mutate({ folderId: deleteDialog.id, parentFolderId: deleteDialog.parentFolderId })
        } else {
            deleteSpecMutation.mutate({ specId: deleteDialog.id, parentFolderId: deleteDialog.parentFolderId })
        }
        setDeleteDialog(null)
    }

    const handleProviderChange = (value: string) => {
        if (value === AI_PROVIDERS.openrouter) {
            setAiProvider(AI_PROVIDERS.openrouter)
            setAiModel(AI_MODELS[AI_PROVIDERS.openrouter])
            return
        }

        setAiProvider(AI_PROVIDERS.google)
        setAiModel(AI_MODELS[AI_PROVIDERS.google])
    }

    const handleAiInputChange = (value: string) => {
        setAiInput(value)
    }

    const handleToggleAiOpen = () => {
        setAiOpen(!aiOpen)
    }

    const handleResetAiChat = () => {
        setAiMessages([])
        setAiError(null)
        setAiProgress([])
    }

    const handleAiSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const trimmedInput = aiInput.trim()
        if (trimmedInput === '') {
            return
        }

        const nextMessages: AiChatMessage[] = [...aiMessages, { role: 'user', content: trimmedInput }]
        setAiMessages(nextMessages)
        setAiInput('')
        setAiIsLoading(true)
        setAiError(null)
        setAiProgress(['Sending request...'])

        const { data, error } = await safeClient.ai.chat({
            messages: nextMessages,
            provider: aiProvider,
            model: aiModel
        })
        const responseData = data as AiChatResponse | undefined

        if (error) {
            setAiError(error.message || 'Request failed')
            setAiIsLoading(false)
            setAiProgress(['Request failed'])
            return
        }

        if (!responseData?.text || responseData.text.trim() === '') {
            setAiError('No response received')
            setAiIsLoading(false)
            setAiProgress(['Empty response'])
            return
        }

        const assistantMessage: AiChatMessage = { role: 'assistant', content: responseData.text }
        setAiMessages([...nextMessages, assistantMessage])
        setAiIsLoading(false)
        const { toolMessages = [], refreshItemIds = [] } = (responseData ?? {}) as {
            toolMessages?: string[]
            refreshItemIds?: string[]
        }

        const nextProgress: string[] = []
        if (toolMessages.length > 0) {
            nextProgress.push(...toolMessages)
        }
        nextProgress.push('Response received')
        setAiProgress(nextProgress)

        if (refreshItemIds.length > 0) {
            for (const itemId of refreshItemIds) {
                await treeRef.current?.refreshItemChildren(itemId)
            }
        }
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
                            ref={treeRef}
                            selectedSpecId={selectedSpec?.id || null}
                            selectedFolderId={selectedFolder?.id || null}
                            onSelectSpec={handleSpecSelect}
                            onSelectFolder={handleFolderSelect}
                            onCreateTest={handleCreateTest}
                            onDeleteFolder={handleDeleteFolderFromTree}
                            onDeleteSpec={handleDeleteSpecFromTree}
                            onEmptySpaceClick={handleEmptySpaceClick}
                        />
                    </div>
                </div>

                <div className="flex flex-col lg:w-1/2">
                    {selectedFolder ? (
                        <FolderDetailsPanel
                            selectedFolder={selectedFolder}
                            onRenameFolder={handleRenameFolder}
                            onDeleteFolder={handleDeleteFolderFromPanel}
                            onSpecSelect={handleSpecSelect}
                            onFolderSelect={handleFolderSelect}
                            onRefreshTreeChildren={async (parentFolderId: string | null) =>
                                treeRef.current?.refreshItemChildren(parentFolderId ?? 'root')
                            }
                        />
                    ) : (
                        <TestDetailsPanel
                            selectedSpec={selectedSpec}
                            selectedRequirements={selectedRequirements}
                            selectedTests={selectedTests}
                            onRenameSpec={handleRenameSpec}
                            onDeleteSpec={handleDeleteSpecFromPanel}
                            onRequirementsUpdated={handleRequirementsUpdated}
                            onRefreshTreeChildren={async (parentFolderId: string | null) =>
                                treeRef.current?.refreshItemChildren(parentFolderId ?? 'root')
                            }
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
            <CreateSpecDialog
                open={createSpecDialogOpen}
                onOpenChange={setCreateSpecDialogOpen}
                onCreateSpec={(name) =>
                    createTestFromTreeMutation.mutate({ name, folderId: createSpecFolderId ?? 'root' })
                }
                isCreating={createTestFromTreeMutation.isPending}
            />
            <AiChatWidget
                aiOpen={aiOpen}
                aiProvider={aiProvider}
                aiMessageItems={aiMessageItems}
                aiInput={aiInput}
                aiError={aiError}
                aiIsLoading={aiIsLoading}
                aiProgress={aiProgress}
                onProviderChange={handleProviderChange}
                onInputChange={handleAiInputChange}
                onSubmit={handleAiSubmit}
                onToggleOpen={handleToggleAiOpen}
                onResetChat={handleResetAiChat}
            />
        </>
    )
}
