'use client'

import { useMemo, useState } from 'react'
import {
    selectionFeature,
    asyncDataLoaderFeature,
    hotkeysCoreFeature,
    dragAndDropFeature,
    keyboardDragAndDropFeature,
    createOnDropHandler
} from '@headless-tree/core'
import { useTree } from '@headless-tree/react'
import { ChevronDown, ChevronRight, FileText, Folder, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SPEC_STATUSES, STATUS_CONFIGS } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { FolderWithChildren, TestFolder, TestSpec, TestRequirement, Test, SpecStatus } from '@/lib/types'

type ItemPayload = { type: 'folder'; folder: FolderWithChildren } | { type: 'spec'; spec: TestSpec }

interface TreeProps {
    folders: TestFolder[]
    specs: TestSpec[]
    requirements: TestRequirement[]
    tests: Test[]
    selectedSpecId: TestSpec['id'] | null
    onSelectSpec: (spec: TestSpec) => void
    onCreateTest?: (folderId: string) => void
    onDeleteFolder?: (folderId: string) => void
    onDeleteSpec?: (specId: string) => void
}

export function Tree({
    folders,
    specs,
    requirements,
    tests,
    selectedSpecId,
    onSelectSpec,
    onCreateTest,
    onDeleteFolder,
    onDeleteSpec
}: TreeProps) {
    const buildHierarchy = useMemo(() => {
        const buildFolder = (folder: TestFolder): FolderWithChildren => {
            const childFolders = folders
                .filter((f) => f.parentFolderId === folder.id)
                .map((child) => buildFolder(child))

            const folderSpecs = specs.filter((spec) => spec.folderId === folder.id)
            return {
                ...folder,
                folders: childFolders,
                specs: folderSpecs
            }
        }

        const roots: FolderWithChildren[] = folders
            .filter((f) => !f.parentFolderId || f.parentFolderId === '0')
            .map(buildFolder)

        const orphanSpecs: TestSpec[] = specs.filter((s) => !s.folderId)
        return { roots, orphanSpecs }
    }, [folders, specs, requirements, tests])

    const { itemsById, foldersById } = useMemo(() => {
        const items: Record<string, ItemPayload> = {}
        const folders: Record<string, string[]> = { root: [] }

        const makeFolderId = (id: string) => `folder:${id}`
        const makeSpecId = (id: string) => `spec:${id}`

        const ensure = (id: string) => {
            if (!folders[id]) folders[id] = []
        }

        // Orphan specs (without folder) go under root
        buildHierarchy.orphanSpecs.forEach((spec) => {
            const sid = makeSpecId(spec.id)
            items[sid] = { type: 'spec', spec }
            folders.root.push(sid)
        })

        const addFolder = (folder: FolderWithChildren, parent: string | null) => {
            const fid = makeFolderId(folder.id)
            items[fid] = { type: 'folder', folder: folder }
            ensure(fid)
            if (parent) {
                ensure(parent)
                folders[parent].push(fid)
            } else {
                folders.root.push(fid)
            }

            // specs of this folder
            folder.specs.forEach((spec) => {
                const sid = makeSpecId(spec.id)
                items[sid] = { type: 'spec', spec }
                folders[fid].push(sid)
            })

            // folders of this folder
            folder.folders.forEach((folder) => addFolder(folder, fid))
        }

        buildHierarchy.roots.forEach((r) => addFolder(r, null))

        return { itemsById: items, foldersById: folders }
    }, [buildHierarchy])

    // Store only overrides produced by drag-and-drop; fall back to computed children
    const [overrides, setOverrides] = useState<Record<string, string[]>>({})

    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [expandedItems, setExpandedItems] = useState<string[]>([])
    const [focusedItem, setFocusedItem] = useState<string | null>(null)

    const tree = useTree<ItemPayload>({
        rootItemId: 'root',
        state: {
            selectedItems,
            expandedItems,
            focusedItem
        },
        setSelectedItems,
        setExpandedItems,
        setFocusedItem,
        isItemFolder: (item) => item.getItemData().type === 'folder',
        canReorder: true,
        indent: 16,

        // ALREADY CHECKED UP TO HERE
        getItemName: (item) => {
            const data = item.getItemData()
            return data.type === 'folder' ? data.folder.name : data.spec.name
        },
        // TODO: make this pretty
        createLoadingItemData: () => ({
            type: 'folder',
            folder: {
                id: 'loading',
                name: 'Loading...',
                description: 'Loading...',
                parentFolderId: 'loading',
                createdAt: new Date(),
                updatedAt: new Date(),
                folders: [],
                specs: [],
                organizationId: 'loading',
                order: 0
            }
        }),
        dataLoader: {
            getItem: (itemId) => itemsById[itemId],
            getChildren: (itemId) => overrides[itemId] ?? foldersById[itemId]
        },
        onDrop: createOnDropHandler((item, newChildren) => {
            const targetId = item.getId()
            setOverrides((prev) => ({ ...prev, [targetId]: newChildren }))
        }),
        features: [
            asyncDataLoaderFeature,
            selectionFeature,
            hotkeysCoreFeature,
            dragAndDropFeature,
            keyboardDragAndDropFeature
        ]
    })

    return (
        <div {...tree.getContainerProps()} className="flex flex-col">
            {tree.getItems().map((item) => {
                const payload = item.getItemData()
                const level = item.getItemMeta().level
                const isFolder = item.isFolder()
                const isExpanded = item.isExpanded()
                const isSelected = payload.type === 'spec' ? selectedSpecId === payload.spec.id : false

                const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
                    item.getProps().onClick?.(e)
                    if (payload.type === 'spec') {
                        onSelectSpec(payload.spec)
                    }
                    setSelectedItems([item.getId()])
                }

                return (
                    <div
                        key={item.getId()}
                        className="group flex items-center"
                        style={{ paddingLeft: `${level * 16}px` }}
                    >
                        <button
                            {...item.getProps()}
                            onClick={onClick}
                            className={cn(
                                'group/button flex flex-1 cursor-pointer items-center gap-2 rounded-sm px-2 py-1 hover:bg-muted/50',
                                isSelected && 'bg-muted'
                            )}
                            type="button"
                        >
                            <div className="flex h-4 w-4 items-center justify-center">
                                {isFolder ?
                                    isExpanded ?
                                        <ChevronDown className="h-3 w-3" />
                                    :   <ChevronRight className="h-3 w-3" />
                                :   <span className="w-3" />}
                            </div>

                            {isFolder ?
                                <Folder className="h-4 w-4 text-muted-foreground" />
                            :   <FileText className="h-4 w-4 text-muted-foreground" />}

                            <span className="flex-1 text-left text-sm font-medium">{item.getItemName()}</span>

                            {payload.type === 'spec' && (
                                <div className="flex items-center gap-2">
                                    {payload.spec.statuses[SPEC_STATUSES.deactivated] &&
                                        (() => {
                                            const config = STATUS_CONFIGS[SPEC_STATUSES.deactivated]
                                            return config?.badgeClassName ?
                                                    <Badge className={config.badgeClassName}>{config.label}</Badge>
                                                :   null
                                        })()}
                                    {payload.spec.numberOfTests > 0 && (
                                        <div className="flex items-center gap-1 text-xs">
                                            {Object.entries(STATUS_CONFIGS).map(([statusKey, config]) => {
                                                const count = payload.spec.statuses[statusKey as SpecStatus]
                                                const color = config.color
                                                return (
                                                    <span key={statusKey} className={cn(color, 'font-medium')}>
                                                        {count}
                                                    </span>
                                                )
                                            })}
                                            <span className="text-muted-foreground">
                                                ({payload.spec.numberOfTests})
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </button>
                        {isFolder && onCreateTest && (
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    if (payload.type === 'folder') {
                                        onCreateTest(payload.folder.id)
                                    }
                                }}
                            >
                                <Plus className="h-3 w-3" />
                            </Button>
                        )}
                        {isFolder && onDeleteFolder && (
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 text-destructive hover:text-destructive"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    if (payload.type === 'folder') {
                                        onDeleteFolder(payload.folder.id)
                                    }
                                }}
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        )}
                        {!isFolder && onDeleteSpec && (
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 text-destructive hover:text-destructive"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    if (payload.type === 'spec') {
                                        onDeleteSpec(payload.spec.id)
                                    }
                                }}
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                )
            })}
            <div
                style={tree.getDragLineStyle()}
                className="h-0.5 -mt-0.5 bg-[#0366d6] before:content-[''] before:absolute before:left-0 before:-top-1 before:h-1 before:w-1 before:bg-white before:border-2 before:border-[#0366d6] before:rounded-full"
            />
        </div>
    )
}
