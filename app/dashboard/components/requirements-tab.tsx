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
    onSaveRequirements: (requirements: TestRequirement[]) => void
}

export function RequirementsTab({ requirements, tests, specId, onSaveRequirements }: RequirementsTabProps) {
    const [editingRequirements, setEditingRequirements] = useState(false)

    const handleSave = (updatedRequirements: TestRequirement[]) => {
        onSaveRequirements(updatedRequirements)
        setEditingRequirements(false)
    }

    return (
        <div>
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-medium text-sm sm:text-base">Test Requirements</h3>
                <Button
                    onClick={() => setEditingRequirements(!editingRequirements)}
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
