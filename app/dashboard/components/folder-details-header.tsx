'use client'

import { Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { TestFolder } from '@/lib/types'

interface FolderDetailsHeaderProps {
    folder: TestFolder
    onDelete: () => void
}

export function FolderDetailsHeader({ folder, onDelete }: FolderDetailsHeaderProps) {
    return (
        <div className="border-b p-3 sm:p-4">
            <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold text-lg sm:text-xl wrap-break-words">{folder.name}</h2>
                        <div className="flex items-center gap-1">
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
