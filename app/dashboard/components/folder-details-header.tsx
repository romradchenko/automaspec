'use client'

import { Edit, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TestFolder } from '@/lib/types'

interface FolderDetailsHeaderProps {
    folder: TestFolder
    onRename: (name: string) => void
    onDelete: () => void
}

export function FolderDetailsHeader({ folder, onRename, onDelete }: FolderDetailsHeaderProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editedName, setEditedName] = useState(folder.name)

    useEffect(() => {
        setEditedName(folder.name)
        setIsEditing(false)
    }, [folder.id, folder.name])

    function handleSaveRename() {
        const trimmed = editedName.trim()
        if (trimmed && trimmed !== folder.name) {
            onRename(trimmed)
        }
        setIsEditing(false)
    }

    function handleCancelRename() {
        setEditedName(folder.name)
        setIsEditing(false)
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            handleSaveRename()
        } else if (e.key === 'Escape') {
            handleCancelRename()
        }
    }

    return (
        <div className="border-b p-3 sm:p-4">
            <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                        {isEditing ? (
                            <Input
                                autoFocus
                                className="h-8 w-full max-w-[200px] sm:max-w-xs"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                onBlur={handleSaveRename}
                                onKeyDown={handleKeyDown}
                            />
                        ) : (
                            <h2 className="font-semibold text-lg sm:text-xl wrap-break-words">{folder.name}</h2>
                        )}
                        <div className="flex items-center gap-1">
                            <Button onClick={() => setIsEditing(!isEditing)} size="sm" variant="ghost">
                                <Edit className="size-4" />
                            </Button>
                            <Button onClick={onDelete} size="sm" variant="ghost">
                                <Trash2 className="size-4" />
                            </Button>
                        </div>
                    </div>
                    {folder.description && (
                        <p className="mb-2 text-muted-foreground text-xs sm:text-sm wrap-break-words">
                            {folder.description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
