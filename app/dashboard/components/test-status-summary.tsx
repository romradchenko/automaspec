'use client'

import { STATUS_CONFIGS, TEST_STATUSES } from '@/lib/constants'
import { Test } from '@/lib/types'

interface TestStatusSummaryProps {
    tests: Test[]
}

export function TestStatusSummary({ tests }: TestStatusSummaryProps) {
    if (tests.length === 0) return null

    return (
        <div className="mb-4 rounded-lg bg-muted/30 p-3">
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                {Object.values(TEST_STATUSES).map((status) => {
                    const count = tests.filter((test: Test) => test.status === status).length

                    if (count === 0) return null

                    const statusConfig = STATUS_CONFIGS[status]
                    const IconComponent = statusConfig.icon

                    return (
                        <div key={status} className="flex items-center gap-1">
                            <IconComponent className={`size-4 ${statusConfig.color}`} />
                            <span className="font-medium">
                                {count} {statusConfig.label}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
