'use client'

import { Badge } from '@/components/ui/badge'
import { STATUS_CONFIGS } from '@/lib/constants'
import { Test, TestRequirement, type TestStatus } from '@/lib/types'

interface RequirementsListProps {
    requirements: TestRequirement[]
    tests: Test[]
}

export function RequirementsList({ requirements, tests }: RequirementsListProps) {
    if (requirements.length === 0) {
        return <div className="text-muted-foreground text-sm">No requirements defined</div>
    }

    return (
        <div className="space-y-2">
            {requirements.map((req: TestRequirement, index: number) => {
                const config =
                    STATUS_CONFIGS[(tests.find((t) => t.requirementId === req.id)?.status || 'pending') as TestStatus]
                const IconComponent = config.icon

                return (
                    <div
                        key={req.id || index}
                        className="group flex flex-col gap-1 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-sm">{req.name}</h4>
                            <Badge variant="outline" className={config.badgeClassName}>
                                <IconComponent className="mr-1.5 size-3" />
                                <span className="text-[11px] uppercase tracking-wide">{config.label}</span>
                            </Badge>
                        </div>
                        {req.description && (
                            <p className="text-muted-foreground text-xs leading-relaxed">{req.description}</p>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
