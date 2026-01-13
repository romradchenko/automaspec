// https://github.com/vitest-dev/vitest/blob/main/packages/vitest/src/node/reporters/json.ts
import type { JsonAssertionResult } from 'vitest/reporters'

import { CheckCircle, XCircle, Clock, MinusCircle, type LucideIcon } from 'lucide-react'

import type { SpecStatus } from './types'

export const TEST_FRAMEWORK = 'vitest'

export const IGNORED_TEST_FOLDERS = new Set(['__tests__', 'tests', 'test', 'e2e'])

export const FILE_UPLOAD = {
    ALLOWED_EXTENSIONS: ['.json'],
    ALLOWED_MIME_TYPES: ['application/json'],
    MAX_SIZE_BYTES: 10 * 1024 * 1024
} as const

export const IMPORT_TESTS_ERRORS = {
    PLAYWRIGHT_REPORT_NOT_SUPPORTED:
        'This looks like a Playwright JSON report. The importer supports Vitest JSON reporter output only.',
    NO_TEST_RESULTS_FOUND: 'No tests found in the report. Make sure this is a Vitest JSON reporter output.'
} as const

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
        color: 'text-muted-foreground',
        label: 'Missing',
        badgeClassName: 'border-border bg-muted/50 text-muted-foreground hover:bg-muted',
        requirementClassName: ''
    },
    [TEST_STATUSES.passed]: {
        icon: CheckCircle,
        color: 'text-green-600',
        label: 'Passed',
        badgeClassName: 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100',
        requirementClassName: ''
    },
    [TEST_STATUSES.failed]: {
        icon: XCircle,
        color: 'text-red-600',
        label: 'Failed',
        badgeClassName: 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100',
        requirementClassName: ''
    },
    [TEST_STATUSES.pending]: {
        icon: Clock,
        color: 'text-yellow-600',
        label: 'Pending',
        badgeClassName: 'border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100',
        requirementClassName: ''
    },
    [TEST_STATUSES.skipped]: {
        icon: MinusCircle,
        color: 'text-muted-foreground',
        label: 'Skipped',
        badgeClassName: 'border-border bg-muted/50 text-muted-foreground hover:bg-muted',
        requirementClassName: ''
    },
    [TEST_STATUSES.todo]: {
        icon: MinusCircle,
        color: 'text-orange-600',
        label: 'Todo',
        badgeClassName: 'border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100',
        requirementClassName: ''
    },
    [SPEC_STATUSES.partial]: {
        icon: MinusCircle,
        color: 'text-orange-600',
        label: 'Partial',
        badgeClassName: 'border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100',
        requirementClassName: ''
    },
    [SPEC_STATUSES.deactivated]: {
        icon: MinusCircle,
        color: 'text-muted-foreground',
        label: 'Deactivated',
        badgeClassName: 'border-border bg-muted/50 text-muted-foreground hover:bg-muted',
        requirementClassName: ''
    },
    [TEST_STATUSES.disabled]: {
        icon: MinusCircle,
        color: 'text-muted-foreground',
        label: 'Disabled',
        badgeClassName: 'border-border bg-muted/50 text-muted-foreground hover:bg-muted',
        requirementClassName: ''
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

export const NODE_ENVS = {
    production: 'production',
    development: 'development',
    test: 'test'
} as const

export const DEMO_CREDENTIALS = {
    email: 'demo@automaspec.com',
    password: 'demo1234'
} as const
