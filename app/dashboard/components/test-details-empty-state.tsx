'use client'

import { FileText, Plus, Folder } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface TestDetailsEmptyStateProps {
    onCreateFolder: () => void
    onCreateTest: () => void
}

export function TestDetailsEmptyState({ onCreateFolder, onCreateTest }: TestDetailsEmptyStateProps) {
    return (
        <div className="flex flex-1 items-center justify-center text-muted-foreground p-4">
            <div className="w-full max-w-md text-center">
                <FileText className="mx-auto mb-4 size-12 opacity-50" />
                <p className="text-sm sm:text-base">Select a spec to view details and requirements</p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-around">
                    <Button variant="outline" onClick={onCreateFolder} className="flex-1 sm:flex-initial">
                        <Folder className="mr-2 size-4" />
                        New Folder
                    </Button>
                    <Button onClick={onCreateTest} className="flex-1 sm:flex-initial">
                        <Plus className="mr-2 size-4" />
                        New Spec
                    </Button>
                </div>
            </div>
        </div>
    )
}
