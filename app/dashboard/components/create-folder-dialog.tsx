'use client'

import { useState } from 'react'

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
    AlertDialogAction
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface CreateFolderDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onCreateFolder: (name: string) => void
    isCreating?: boolean
}

export function CreateFolderDialog({ open, onOpenChange, onCreateFolder, isCreating }: CreateFolderDialogProps) {
    const [folderName, setFolderName] = useState('')

    function handleCreate() {
        const trimmed = folderName.trim()
        if (trimmed) {
            onCreateFolder(trimmed)
            setFolderName('')
        }
    }

    function handleOpenChange(open: boolean) {
        if (!open) {
            setFolderName('')
        }
        onOpenChange(open)
    }

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Create New Folder</AlertDialogTitle>
                    <AlertDialogDescription>Enter a name for the new folder.</AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                    <Label htmlFor="folder-name">Folder Name</Label>
                    <Input
                        id="folder-name"
                        autoFocus
                        placeholder="e.g., Unit Tests, Integration Tests"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleCreate()
                            }
                        }}
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCreate} disabled={isCreating || !folderName.trim()}>
                        {isCreating ? 'Creating...' : 'Create'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
