'use client'

import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { TestRequirement } from '@/lib/types'

interface RequirementsEditorProps {
    requirements: TestRequirement[]
    specId: string
    onSave: (requirements: TestRequirement[]) => void
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
        } as TestRequirement
        setRequirements(updated)
    }

    const handleDeleteRequirement = (index: number) => {
        const updated = requirements.filter((_: unknown, i: number) => i !== index)
        setRequirements(updated)
    }

    const handleAddRequirement = () => {
        const newReq: TestRequirement = {
            id: `req-${Date.now()}`,
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
        onSave(requirements)
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                {requirements.map((req: TestRequirement, index: number) => (
                    <div key={req.id || index} className="flex items-center gap-2 rounded-lg border p-2 sm:p-3">
                        <input
                            className="min-w-0 flex-1 bg-transparent text-xs sm:text-sm outline-none"
                            onChange={(e) => handleRequirementChange(index, e.target.value)}
                            placeholder="Enter requirement..."
                            value={req.name || ''}
                        />
                        <Button
                            onClick={() => handleDeleteRequirement(index)}
                            size="sm"
                            variant="ghost"
                            className="shrink-0"
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                ))}
                <Button onClick={handleAddRequirement} size="sm" variant="outline" className="w-full sm:w-auto">
                    <Plus className="mr-2 size-4" />
                    Add Requirement
                </Button>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button onClick={onCancel} variant="outline" className="w-full sm:w-auto">
                    Cancel
                </Button>
                <Button onClick={handleSave} className="w-full sm:w-auto">
                    Save Requirements
                </Button>
            </div>
        </div>
    )
}
