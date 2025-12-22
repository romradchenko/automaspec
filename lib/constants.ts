// https://github.com/vitest-dev/vitest/blob/main/packages/vitest/src/node/reporters/json.ts
import type { JsonAssertionResult } from 'vitest/reporters'

import { CheckCircle, XCircle, Clock, MinusCircle, type LucideIcon } from 'lucide-react'

import type { SpecStatus } from './types'

export const TEST_FRAMEWORK = 'vitest'
export const ORGANIZATION_PLANS = {
    free: 'free',
    pro: 'pro',
    enterprise: 'enterprise'
} as const

export const AI_PROVIDERS = {
    openrouter: 'openrouter',
    google: 'google'
} as const

export const AI_MODELS = {
    openrouter: 'kwaipilot/kat-coder-pro:free',
    google: 'gemini-2.5-flash'
} as const
export const AI_MAX_PROMPT_LENGTH = 2000
export const AI_BLOCKED_PATTERNS = [
    'ignore previous instructions',
    'disregard previous instructions',
    'disregard prior instructions',
    'drop database',
    'disable safety',
    'delete all data'
] as const
export const AI_RATE_LIMIT_WINDOW_MS = 60000
export const AI_RATE_LIMIT_MAX_REQUESTS = 30

export const AI_PROVIDER_LABELS = {
    openrouter: 'OpenRouter (free)',
    google: 'Gemini (Google)'
} as const

export const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'
export const AI_ENV_KEYS = {
    openrouter: 'OPENROUTER_API_KEY',
    google: 'GEMINI_API_KEY'
} as const

export const MEMBER_ROLES = {
    owner: 'owner',
    admin: 'admin',
    member: 'member'
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

export const ANALYTICS_PERIODS = {
    '7d': 7,
    '30d': 30,
    '90d': 90
} as const

export const ERROR_PAGE_CONTENT = {
    notFound: {
        code: '404',
        title: 'Page not found',
        description: 'The page you are looking for does not exist or has been moved.',
        primaryActionLabel: 'Return home',
        primaryActionHref: '/',
        secondaryActionLabel: 'Open dashboard',
        secondaryActionHref: '/dashboard'
    },
    serverError: {
        code: '500',
        title: 'Something went wrong',
        description: 'An unexpected error occurred. Please try again or head back to the main page.',
        primaryActionLabel: 'Try again',
        secondaryActionLabel: 'Back home',
        secondaryActionHref: '/'
    },
    badRequest: {
        code: '400',
        title: 'Bad request',
        description: 'The request was invalid or cannot be processed.',
        primaryActionLabel: 'Try again',
        secondaryActionLabel: 'Back home',
        secondaryActionHref: '/'
    },
    unauthorized: {
        code: '401',
        title: 'Unauthorized',
        description: 'You need to be logged in to access this page.',
        primaryActionLabel: 'Log in',
        primaryActionHref: '/login',
        secondaryActionLabel: 'Back home',
        secondaryActionHref: '/'
    },
    forbidden: {
        code: '403',
        title: 'Forbidden',
        description: 'You do not have permission to access this page.',
        primaryActionLabel: 'Back home',
        primaryActionHref: '/',
        secondaryActionLabel: 'Open dashboard',
        secondaryActionHref: '/dashboard'
    }
} as const
