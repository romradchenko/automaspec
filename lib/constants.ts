import { CheckCircle, XCircle, Clock, MinusCircle, type LucideIcon } from 'lucide-react'
// https://github.com/vitest-dev/vitest/blob/main/packages/vitest/src/node/reporters/json.ts
import type { JsonAssertionResult } from 'vitest/reporters'
import type { SpecStatus } from './types'

export const TEST_FRAMEWORK = 'vitest'
export const ORGANIZATION_PLANS = {
    free: 'free',
    pro: 'pro',
    enterprise: 'enterprise'
} as const

export type OrganizationPlan = keyof typeof ORGANIZATION_PLANS

export const TEST_STATUSES = {
    passed: 'passed',
    skipped: 'skipped',
    todo: 'todo',
    failed: 'failed',
    pending: 'pending',
    disabled: 'disabled',
    // THIS IS OUR SPECIFIC STATUS FOR TESTS THAT ARE MISSING IN REPORT
    missing: 'missing'
} as const satisfies { [K in JsonAssertionResult['status'] | 'missing']: string }

export const SPEC_STATUSES = {
    ...TEST_STATUSES,
    deactivated: 'deactivated',
    partial: 'partial'
} as const

export type StatusConfig = {
    icon: LucideIcon
    color: string
    label: string
    badgeClassName: string
    requirementClassName: string
}

export const STATUS_CONFIGS = {
    [TEST_STATUSES.missing]: {
        icon: MinusCircle,
        color: 'text-slate-600',
        label: 'Missing',
        badgeClassName: 'border-slate-200 bg-slate-100 text-slate-800',
        requirementClassName: 'text-slate-700 bg-slate-50'
    },
    [TEST_STATUSES.passed]: {
        icon: CheckCircle,
        color: 'text-emerald-600',
        label: 'Passed',
        badgeClassName: 'border-emerald-200 bg-emerald-100 text-emerald-800',
        requirementClassName: 'text-emerald-800 bg-emerald-50'
    },
    [TEST_STATUSES.failed]: {
        icon: XCircle,
        color: 'text-red-600',
        label: 'Failed',
        badgeClassName: 'border-red-200 bg-red-100 text-red-800',
        requirementClassName: 'text-red-800 bg-red-50'
    },
    [TEST_STATUSES.pending]: {
        icon: Clock,
        color: 'text-amber-600',
        label: 'Pending',
        badgeClassName: 'border-amber-200 bg-amber-100 text-amber-800',
        requirementClassName: 'text-amber-800 bg-amber-50'
    },
    [TEST_STATUSES.skipped]: {
        icon: MinusCircle,
        color: 'text-slate-600',
        label: 'Skipped',
        badgeClassName: 'border-slate-200 bg-slate-100 text-slate-800',
        requirementClassName: 'text-slate-700 bg-slate-50'
    },
    [TEST_STATUSES.todo]: {
        icon: MinusCircle,
        color: 'text-orange-600',
        label: 'Todo',
        badgeClassName: 'border-orange-200 bg-orange-100 text-orange-800',
        requirementClassName: 'text-orange-800 bg-orange-50'
    },
    [SPEC_STATUSES.partial]: {
        icon: MinusCircle,
        color: 'text-orange-600',
        label: 'Partial',
        badgeClassName: 'border-orange-200 bg-orange-100 text-orange-800',
        requirementClassName: 'text-orange-800 bg-orange-50'
    },
    [SPEC_STATUSES.deactivated]: {
        icon: MinusCircle,
        color: 'text-slate-600',
        label: 'Deactivated',
        badgeClassName: 'border-slate-200 bg-slate-100 text-slate-800',
        requirementClassName: 'text-slate-700 bg-slate-50'
    },
    [TEST_STATUSES.disabled]: {
        icon: MinusCircle,
        color: 'text-slate-600',
        label: 'Disabled',
        badgeClassName: 'border-slate-200 bg-slate-100 text-slate-800',
        requirementClassName: 'text-slate-700 bg-slate-50'
    }
} as const satisfies { [K in SpecStatus]: StatusConfig }

export const TEST_RESULTS_FILE = 'test-results.json'
