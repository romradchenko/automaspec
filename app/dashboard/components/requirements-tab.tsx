'use client'

import { Edit } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Test, TestRequirement } from '@/lib/types'

import { RequirementsEditor } from './requirements-editor'
import { RequirementsList } from './requirements-list'
import { TestStatusSummary } from './test-status-summary'

interface RequirementsTabProps {
    requirements: TestRequirement[]
    tests: Test[]
    specId: string
    onSaveRequirements: (requirements: TestRequirement[], deletedIds: string[]) => void
    onRequirementsUpdated?: (requirements: TestRequirement[]) => void
}

export function RequirementsTab({
    requirements,
    tests,
    specId,
    onSaveRequirements,
    onRequirementsUpdated
}: RequirementsTabProps) {
    const [editingRequirements, setEditingRequirements] = useState(false)
    const [originalRequirements, setOriginalRequirements] = useState<TestRequirement[]>([])

    const handleEditStart = () => {
        setOriginalRequirements(requirements)
        setEditingRequirements(true)
    }

    const handleSave = (updatedRequirements: TestRequirement[]) => {
        const originalIds = new Set(originalRequirements.map((req) => req.id))
        const newIds = new Set(updatedRequirements.map((req) => req.id))
        const deletedIds = Array.from(originalIds).filter((id) => !newIds.has(id))

        onSaveRequirements(updatedRequirements, deletedIds)
        onRequirementsUpdated?.(updatedRequirements)
        setEditingRequirements(false)
    }

    return (
        <div>
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-medium text-sm sm:text-base">Test Requirements</h3>
                <Button
                    onClick={() => (editingRequirements ? setEditingRequirements(false) : handleEditStart())}
                    size="sm"
                    variant="outline"
                    className="w-full sm:w-auto"
                >
                    <Edit className="mr-1 size-4" />
                    {editingRequirements ? 'Cancel' : 'Edit'}
                </Button>
            </div>

            {requirements.length > 0 && <TestStatusSummary tests={tests} />}

            {editingRequirements ? (
                <RequirementsEditor
                    requirements={requirements}
                    specId={specId}
                    onSave={handleSave}
                    onCancel={() => setEditingRequirements(false)}
                />
            ) : (
                <RequirementsList requirements={requirements} tests={tests} />
            )}
        </div>
    )
}
