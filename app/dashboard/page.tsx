'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { toast } from 'sonner'

import type { AiChatMessage, AiProvider, TestSpec, Test, TestRequirement, TestFolder } from '@/lib/types'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { DEFAULT_SPEC_STATUSES } from '@/db/schema'
import { AI_MODELS, AI_PROVIDER_LABELS, AI_PROVIDERS } from '@/lib/constants'
import { orpc, safeClient } from '@/lib/orpc/orpc'
import { authClient } from '@/lib/shared/better-auth-client'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'

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
        onSuccess: async (_, folderId) => {
            await invalidateAndRefetchQueries(queryClient, '/test-specs')
            await treeRef.current?.refreshItemChildren(folderId)
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
            toast.success('Test deleted successfully')
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete test')
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

        const { data, error } = await safeClient.ai.chat({
            messages: nextMessages,
            provider: aiProvider,
            model: aiModel
        })

        if (error) {
            setAiError(error.message || 'Request failed')
            setAiIsLoading(false)
            return
        }

        if (!data?.text || data.text.trim() === '') {
            setAiError('No response received')
            setAiIsLoading(false)
            return
        }

        const assistantMessage: AiChatMessage = { role: 'assistant', content: data.text }
        setAiMessages([...nextMessages, assistantMessage])
        setAiIsLoading(false)
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
                            onCreateTest={createTestSpecMutation.mutate}
                            onDeleteFolder={handleDeleteFolderFromTree}
                            onDeleteSpec={handleDeleteSpecFromTree}
                        />
                    </div>
                </div>

                <div className="flex flex-col lg:w-1/2">
                    {selectedFolder ? (
                        <FolderDetailsPanel
                            selectedFolder={selectedFolder}
                            onDeleteFolder={handleDeleteFolder}
                            onRefreshTreeChildren={(parentFolderId: string | null) =>
                                treeRef.current?.refreshItemChildren(parentFolderId ?? 'root')
                            }
                        />
                    ) : (
                        <TestDetailsPanel
                            selectedSpec={selectedSpec}
                            selectedRequirements={selectedRequirements}
                            selectedTests={selectedTests}
                            onDeleteSpec={handleDeleteSpec}
                            onRefreshTreeChildren={(parentFolderId: string | null) =>
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
            <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
                {aiOpen ? (
                    <div className="w-80 rounded-lg border bg-background shadow-lg">
                        <div className="flex items-center justify-between border-b px-3 py-2">
                            <div className="flex gap-2">
                                <select
                                    className="h-9 rounded-md border bg-background px-2 text-xs"
                                    value={aiProvider}
                                    onChange={(event) => handleProviderChange(event.target.value)}
                                >
                                    <option value={AI_PROVIDERS.google}>{AI_PROVIDER_LABELS.google}</option>
                                    <option value={AI_PROVIDERS.openrouter}>{AI_PROVIDER_LABELS.openrouter}</option>
                                </select>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => {
                                        setAiMessages([])
                                        setAiError(null)
                                    }}
                                >
                                    New Chat
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 px-3 py-3">
                            {aiMessageItems.length > 0 ? (
                                <div className="max-h-64 space-y-2 overflow-auto rounded-md border bg-muted p-2 text-sm">
                                    {aiMessageItems.map((message) => (
                                        <div key={message.key} className="rounded-md bg-background p-2">
                                            <p className="text-[11px] font-semibold uppercase text-muted-foreground">
                                                {message.role}
                                            </p>
                                            <p className="whitespace-pre-line">{message.content}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : null}
                            {aiIsLoading ? <p className="text-xs text-muted-foreground">Thinking...</p> : null}
                            <form className="space-y-2" onSubmit={handleAiSubmit}>
                                <Textarea
                                    value={aiInput}
                                    onChange={(event) => setAiInput(event.target.value)}
                                    rows={3}
                                    placeholder="Ask about your tests or requirements"
                                />
                                {aiError ? <p className="text-xs text-red-600">{aiError}</p> : null}
                                <Button type="submit" size="sm" disabled={aiIsLoading} className="w-full">
                                    {aiIsLoading ? 'Thinking...' : 'Send'}
                                </Button>
                            </form>
                        </div>
                    </div>
                ) : null}
                <Button size="lg" className="rounded-full shadow-lg" onClick={() => setAiOpen(!aiOpen)}>
                    {aiOpen ? 'Hide Chat' : 'Chat with AI'}
                </Button>
            </div>
        </>
    )
}
