'use client'

import { Plus, Trash2, GripVertical } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { TestRequirement } from '@/lib/types'

interface RequirementsEditorProps {
    requirements: TestRequirement[]
    specId: string
    onSave: (requirements: TestRequirement[], deletedIds: string[]) => void
    onCancel: () => void
}

export function RequirementsEditor({
    requirements: initialRequirements,
    specId,
    onSave,
    onCancel
}: RequirementsEditorProps) {
    const [requirements, setRequirements] = useState<TestRequirement[]>(initialRequirements)

    const handleRequirementChange = (index: number, name: string) => {
        const updated = [...requirements]
        updated[index] = {
            ...updated[index],
            name
        }
        setRequirements(updated)
    }

    const handleDeleteRequirement = (index: number) => {
        const updated = requirements.filter((_, i) => i !== index)
        setRequirements(updated)
    }

    const handleAddRequirement = () => {
        const newReq: TestRequirement = {
            id: crypto.randomUUID(),
            name: '',
            description: null,
            order: requirements.length,
            specId,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        setRequirements([...requirements, newReq])
    }

    const handleSave = () => {
        const nonEmptyRequirements = requirements.filter((req) => req.name && req.name.trim() !== '')
        const originalIds = new Set(initialRequirements.map((req) => req.id))
        const newIds = new Set(nonEmptyRequirements.map((req) => req.id))
        const deletedIds = Array.from(originalIds).filter((id) => !newIds.has(id))
        onSave(nonEmptyRequirements, deletedIds)
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                {requirements.map((req: TestRequirement, index: number) => (
                    <div
                        key={req.id || index}
                        className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3 transition-colors hover:bg-muted/50"
                    >
                        <GripVertical className="text-muted-foreground size-4 shrink-0" />
                        <input
                            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                            onChange={(e) => handleRequirementChange(index, e.target.value)}
                            placeholder="Enter requirement name..."
                            value={req.name || ''}
                        />
                        <Button
                            onClick={() => handleDeleteRequirement(index)}
                            size="icon"
                            variant="ghost"
                            className="shrink-0 text-muted-foreground hover:text-destructive"
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                ))}
                <Button onClick={handleAddRequirement} size="sm" variant="outline" className="w-full">
                    <Plus className="mr-2 size-4" />
                    Add Requirement
                </Button>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button onClick={onCancel} variant="outline" className="w-full sm:w-auto">
                    Cancel
                </Button>
                <Button onClick={handleSave} className="w-full sm:w-auto">
                    Save Changes
                </Button>
            </div>
        </div>
    )
}
