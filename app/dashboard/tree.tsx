'use client'
import { ChevronDown, ChevronRight, FileText, Folder, Plus, Trash2 } from 'lucide-react'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { toast } from 'sonner'

import type { TestSpec } from '@/lib/types'

import { Button } from '@/components/ui/button'
import { safeClient } from '@/lib/orpc/orpc'
import { cn } from '@/lib/utils'
import {
    asyncDataLoaderFeature,
    selectionFeature,
    hotkeysCoreFeature,
    dragAndDropFeature,
    keyboardDragAndDropFeature,
    createOnDropHandler
} from '@headless-tree/core'
import { useTree } from '@headless-tree/react'
import { useQueryClient } from '@tanstack/react-query'

import { invalidateAndRefetchQueries } from './hooks'

interface TreeProps {
    selectedSpecId: TestSpec['id'] | null
    selectedFolderId: string | null
    onSelectSpec: (spec: TestSpec) => void
    onSelectFolder?: (folderId: string) => void
    onCreateTest?: (folderId: string) => void
    onDeleteFolder?: (folderId: string, parentFolderId: string | null) => void
    onDeleteSpec?: (specId: string, parentFolderId: string | null) => void
}

export type TreeHandle = {
    refreshItemChildren: (itemId: string) => Promise<void>
}

async function getFolderContent(
    folderId: string,
    depth: number = 0
): Promise<
    Array<{
        id: string
        data: {
            name: string
            type: 'folder' | 'spec'
            id: string
            children?: Array<{ id: string; name: string; type: 'folder' | 'spec' }>
        }
    }>
> {
    const { data: children, error } = await safeClient.testFolders.getChildren({ folderId, depth })

    if (error) throw error
    return children.map((child) => ({
        id: child.id,
        data: child
    }))
}

async function getSpecById(specId: string): Promise<TestSpec | null> {
    const { data: spec, error } = await safeClient.testSpecs.get({ id: specId })
    if (error) throw error
    return spec
}

async function getFolderItemData(itemId: string): Promise<{ name: string; type: 'folder' | 'spec'; id: string }> {
    const { data: folder, error } = await safeClient.testFolders.get({ id: itemId })
    if (error) throw error
    if (folder) {
        return { name: folder.name, type: 'folder', id: folder.id }
    }

    const { data: spec, error: error2 } = await safeClient.testSpecs.get({ id: itemId })
    if (error2) throw error2
    if (spec) {
        return { name: spec.name, type: 'spec', id: spec.id }
    }

    throw new Error(`Item with id ${itemId} not found`)
}

export const Tree = forwardRef<TreeHandle, TreeProps>(function Tree(
    { selectedSpecId, selectedFolderId, onSelectSpec, onSelectFolder, onCreateTest, onDeleteFolder, onDeleteSpec },
    ref
) {
    const queryClient = useQueryClient()
    const [loadingItemData, setLoadingItemData] = useState<string[]>([])
    const [loadingItemChildrens, setLoadingItemChildrens] = useState<string[]>([])
    const [overrides, setOverrides] = useState<Record<string, string[]>>({})
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [expandedItems, setExpandedItems] = useState<string[]>([])
    const [focusedItem, setFocusedItem] = useState<string | null>(null)
    const previousChildrenRef = useRef<Record<string, string[]>>({})
    const preloadedChildrenCache = useRef<
        Record<string, Array<{ id: string; data: { name: string; type: 'folder' | 'spec'; id: string } }>>
    >({})

    const tree = useTree<{ type: 'folder' | 'spec'; id: string; name: string }>({
        rootItemId: 'root',
        state: {
            loadingItemData,
            loadingItemChildrens,
            selectedItems,
            expandedItems,
            focusedItem
        },
        setLoadingItemData,
        setLoadingItemChildrens,
        setSelectedItems,
        setExpandedItems,
        setFocusedItem,
        getItemName: (item) => item.getItemData().name,
        isItemFolder: (item) => item.getItemData().type === 'folder',
        canReorder: true,
        createLoadingItemData: () => ({ type: 'folder', id: 'loading', name: 'Loading...' }),
        dataLoader: {
            getItem: (itemId) => getFolderItemData(itemId),
            getChildrenWithData: async (itemId) => {
                if (preloadedChildrenCache.current[itemId]) {
                    const cached = preloadedChildrenCache.current[itemId]
                    previousChildrenRef.current[itemId] = cached.map((c) => c.id)
                    return cached
                }

                const depth = itemId === 'root' ? 2 : 0
                const children = await getFolderContent(itemId, depth)

                if (depth > 0) {
                    const flattenChildren = (items: typeof children) => {
                        for (const item of items) {
                            if (item.data.children) {
                                const childrenData = item.data.children.map((child) => ({
                                    id: child.id,
                                    data: { name: child.name, type: child.type, id: child.id }
                                }))
                                preloadedChildrenCache.current[item.id] = childrenData
                                flattenChildren(childrenData)
                            }
                        }
                    }
                    flattenChildren(children)
                }

                if (overrides[itemId]) {
                    const overrideMap = new Map<
                        string,
                        { id: string; data: { name: string; type: 'folder' | 'spec'; id: string } }
                    >()
                    for (const child of children) {
                        overrideMap.set(child.id, child)
                    }
                    const result: Array<{ id: string; data: { name: string; type: 'folder' | 'spec'; id: string } }> =
                        []
                    for (const id of overrides[itemId]) {
                        const existing = overrideMap.get(id)
                        if (existing) {
                            result.push(existing)
                        } else {
                            const itemData = await getFolderItemData(id)
                            result.push({ id, data: itemData })
                        }
                    }
                    previousChildrenRef.current[itemId] = result.map((r) => r.id)
                    return result
                }
                previousChildrenRef.current[itemId] = children.map((c) => c.id)
                return children
            }
        },
        onDrop: createOnDropHandler(async (item, newChildren) => {
            const targetId = item.getId()
            const previousChildren = previousChildrenRef.current[targetId] ?? []

            setOverrides((prev) => ({ ...prev, [targetId]: newChildren }))

            const newParentId = targetId === 'root' ? null : targetId
            const previousChildrenSet = new Set(previousChildren)

            const movedItems: string[] = []
            for (const childId of newChildren) {
                if (!previousChildrenSet.has(childId)) {
                    movedItems.push(childId)
                }
            }

            const removedItems: string[] = []
            for (const childId of previousChildren) {
                if (!newChildren.includes(childId)) {
                    removedItems.push(childId)
                }
            }

            if (movedItems.length > 0 || removedItems.length > 0) {
                try {
                    const { data: allFolders, error: error1 } = await safeClient.testFolders.list({})
                    if (error1) throw error1
                    const { data: allSpecs, error: error2 } = await safeClient.testSpecs.list({})
                    if (error2) throw error2

                    const updatePromises: Array<Promise<unknown>> = []

                    for (const itemId of movedItems) {
                        const folder = allFolders.find((f) => f.id === itemId)
                        if (folder) {
                            updatePromises.push(
                                safeClient.testFolders.upsert({
                                    id: folder.id,
                                    name: folder.name,
                                    description: folder.description,
                                    parentFolderId: newParentId,
                                    organizationId: folder.organizationId,
                                    order: folder.order
                                })
                            )
                        } else {
                            const spec = allSpecs.find((s) => s.id === itemId)
                            if (spec) {
                                updatePromises.push(
                                    safeClient.testSpecs.upsert({
                                        id: spec.id,
                                        name: spec.name,
                                        fileName: spec.fileName,
                                        description: spec.description,
                                        folderId: newParentId,
                                        organizationId: spec.organizationId,
                                        statuses: spec.statuses,
                                        numberOfTests: spec.numberOfTests
                                    })
                                )
                            }
                        }
                    }

                    for (const itemId of removedItems) {
                        const folder = allFolders.find((f) => f.id === itemId)
                        if (folder) {
                            const oldParentId = folder.parentFolderId
                            if (oldParentId !== newParentId) {
                                for (const [parentId, children] of Object.entries(previousChildrenRef.current)) {
                                    if (children.includes(itemId) && parentId !== targetId) {
                                        setOverrides((prev) => {
                                            const updated = { ...prev }
                                            if (updated[parentId]) {
                                                updated[parentId] = updated[parentId].filter((id) => id !== itemId)
                                            }
                                            return updated
                                        })
                                        break
                                    }
                                }
                            }
                        } else {
                            const spec = allSpecs.find((s) => s.id === itemId)
                            if (spec) {
                                const oldParentId = spec.folderId
                                if (oldParentId !== newParentId) {
                                    for (const [parentId, children] of Object.entries(previousChildrenRef.current)) {
                                        if (children.includes(itemId) && parentId !== targetId) {
                                            setOverrides((prev) => {
                                                const updated = { ...prev }
                                                if (updated[parentId]) {
                                                    updated[parentId] = updated[parentId].filter((id) => id !== itemId)
                                                }
                                                return updated
                                            })
                                            break
                                        }
                                    }
                                }
                            }
                        }
                    }

                    await Promise.all(updatePromises)
                    await invalidateAndRefetchQueries(queryClient, '/test-folders')
                    await invalidateAndRefetchQueries(queryClient, '/test-specs')
                    previousChildrenRef.current[targetId] = newChildren
                } catch (error) {
                    toast.error(error instanceof Error ? error.message : 'Failed to move items')
                }
            } else {
                previousChildrenRef.current[targetId] = newChildren
            }
        }),
        indent: 16,
        features: [
            asyncDataLoaderFeature,
            selectionFeature,
            hotkeysCoreFeature,
            dragAndDropFeature,
            keyboardDragAndDropFeature
        ]
    })

    const refreshItemChildren = async (itemId: string) => {
        const { [itemId]: _cached, ...restCached } = preloadedChildrenCache.current
        preloadedChildrenCache.current = restCached
        const { [itemId]: _previous, ...restPrevious } = previousChildrenRef.current
        previousChildrenRef.current = restPrevious
        const instance = tree.getItemInstance(itemId) as unknown as {
            invalidateChildrenIds?: (optimistic?: boolean) => Promise<void>
        }
        if (instance.invalidateChildrenIds) {
            await instance.invalidateChildrenIds()
        } else {
            await tree.loadChildrenIds(itemId)
        }
    }

    useImperativeHandle(ref, () => ({
        refreshItemChildren
    }))

    return (
        <div {...tree.getContainerProps()} className="flex flex-col">
            {tree.getItems().map((item) => {
                const payload = item.getItemData()
                const level = item.getItemMeta().level
                const parentId = item.getItemMeta().parentId
                const isFolder = item.isFolder()
                const isExpanded = item.isExpanded()
                const isSelected =
                    payload.type === 'spec'
                        ? selectedSpecId === payload.id
                        : payload.type === 'folder'
                          ? selectedFolderId === payload.id
                          : item.isSelected()

                const onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
                    item.getProps().onClick?.(e)
                    if (payload.type === 'spec') {
                        const spec = await getSpecById(payload.id)
                        if (spec) {
                            onSelectSpec(spec)
                        }
                    } else if (payload.type === 'folder' && onSelectFolder) {
                        onSelectFolder(payload.id)
                    }
                    setSelectedItems([item.getId()])
                }

                return (
                    <div
                        key={item.getId()}
                        className="group relative flex items-center"
                        style={{ paddingLeft: `${level * 16}px` }}
                    >
                        <button
                            {...item.getProps()}
                            onClick={onClick}
                            className={cn(
                                'group/button flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-lg px-3 py-3 transition-colors active:bg-muted/70 sm:rounded-sm sm:px-2 sm:py-1 sm:hover:bg-muted/50',
                                isSelected && 'bg-muted'
                            )}
                            type="button"
                        >
                            <div className="flex size-5 shrink-0 items-center justify-center sm:size-4">
                                {isFolder ? (
                                    isExpanded ? (
                                        <ChevronDown className="size-4 sm:size-3" />
                                    ) : (
                                        <ChevronRight className="size-4 sm:size-3" />
                                    )
                                ) : (
                                    <span className="w-4 sm:w-3" />
                                )}
                            </div>

                            {isFolder ? (
                                <Folder className="size-6 shrink-0 text-muted-foreground sm:size-4" />
                            ) : (
                                <FileText className="size-6 shrink-0 text-muted-foreground sm:size-4" />
                            )}

                            <span className="min-w-0 flex-1 truncate text-left text-base font-medium sm:text-sm">
                                {item.getItemName()}
                            </span>
                            {item.isLoading() && (
                                <span className="shrink-0 text-xs text-muted-foreground">(loading...)</span>
                            )}
                        </button>
                        <div className="absolute right-2 flex items-center gap-1 opacity-100 sm:relative sm:right-0 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                            {isFolder && onCreateTest && (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="size-8 shrink-0 touch-manipulation sm:size-6"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        if (payload.type === 'folder') {
                                            onCreateTest(payload.id)
                                        }
                                    }}
                                >
                                    <Plus className="size-4 sm:size-3" />
                                </Button>
                            )}
                            {isFolder && onDeleteFolder && (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="size-8 shrink-0 touch-manipulation text-destructive hover:text-destructive sm:size-6"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        if (payload.type === 'folder') {
                                            onDeleteFolder(payload.id, parentId === 'root' ? null : parentId)
                                        }
                                    }}
                                >
                                    <Trash2 className="size-4 sm:size-3" />
                                </Button>
                            )}
                            {!isFolder && onDeleteSpec && (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="size-8 shrink-0 touch-manipulation text-destructive hover:text-destructive sm:size-6"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        if (payload.type === 'spec') {
                                            onDeleteSpec(payload.id, parentId === 'root' ? null : parentId)
                                        }
                                    }}
                                >
                                    <Trash2 className="size-4 sm:size-3" />
                                </Button>
                            )}
                        </div>
                    </div>
                )
            })}
            <div
                style={tree.getDragLineStyle()}
                className="h-0.5 -mt-0.5 bg-[#0366d6] before:content-[''] before:absolute before:left-0 before:-top-1 before:h-1 before:w-1 before:bg-white before:border-2 before:border-[#0366d6] before:rounded-full"
            />
        </div>
    )
})
