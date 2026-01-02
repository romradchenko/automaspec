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

interface CreateSpecDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onCreateSpec: (name: string) => void
    isCreating?: boolean
}

export function CreateSpecDialog({ open, onOpenChange, onCreateSpec, isCreating }: CreateSpecDialogProps) {
    const [specName, setSpecName] = useState('')

    function handleCreate() {
        const trimmed = specName.trim()
        if (trimmed) {
            onCreateSpec(trimmed)
            setSpecName('')
        }
    }

    function handleOpenChange(open: boolean) {
        if (!open) {
            setSpecName('')
        }
        onOpenChange(open)
    }

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Create New Test Spec</AlertDialogTitle>
                    <AlertDialogDescription>Enter a name for the new test spec.</AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                    <Label htmlFor="spec-name">Spec Name</Label>
                    <Input
                        id="spec-name"
                        autoFocus
                        placeholder="e.g., User Authentication Tests, API Endpoints Tests"
                        value={specName}
                        onChange={(e) => setSpecName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleCreate()
                            }
                        }}
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCreate} disabled={isCreating || !specName.trim()}>
                        {isCreating ? 'Creating...' : 'Create'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
