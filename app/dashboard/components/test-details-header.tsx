'use client'

import { Edit, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SPEC_STATUSES } from '@/lib/constants'
import { TestSpec } from '@/lib/types'

interface TestDetailsHeaderProps {
    spec: TestSpec
    onDelete: () => void
}

export function TestDetailsHeader({ spec, onDelete }: TestDetailsHeaderProps) {
    return (
        <div className="border-b p-3 sm:p-4">
            <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold text-lg sm:text-xl wrap-break-words">{spec.name}</h2>
                        <div className="flex items-center gap-1">
                            <Button onClick={onDelete} size="sm" variant="ghost">
                                <Edit className="size-4" />
                            </Button>
                            <Button
                                onClick={onDelete}
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive"
                            >
                                <Trash2 className="size-4" />
                            </Button>
                        </div>
                    </div>
                    <p className="mb-2 text-muted-foreground text-xs sm:text-sm wrap-break-words">{spec.description}</p>
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">{spec.statuses[SPEC_STATUSES.deactivated]}</Badge>
                        <Badge variant="outline" className="break-all">
                            {spec.fileName || 'No file'}
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    )
}
