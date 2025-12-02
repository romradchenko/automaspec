'use client'

import { Badge } from '@/components/ui/badge'
import { STATUS_CONFIGS } from '@/lib/constants'
import { Test, TestRequirement, type TestStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

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
                const badge = (
                    <Badge className={config.requirementClassName}>
                        <IconComponent className="mr-1 size-4" />
                        {config.label}
                    </Badge>
                )
                const color = config.requirementClassName
                return (
                    <div
                        className={cn('flex items-start gap-2 rounded-lg border p-2 sm:gap-3 sm:p-3', color)}
                        key={req.id || index}
                    >
                        <div className="mt-0.5 shrink-0">{badge}</div>
                        <div className="min-w-0 flex-1">
                            <span className="font-medium text-xs sm:text-sm wrap-break-words">{req.name}</span>
                            {req.description && (
                                <div className="mt-1 text-muted-foreground text-xs wrap-break-words">
                                    {req.description}
                                </div>
                            )}
                            <div className="mt-1 text-muted-foreground text-xs">
                                Status:{' '}
                                <span className="capitalize">
                                    {tests.find((t) => t.requirementId === req.id)?.status || 'pending'}
                                </span>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
