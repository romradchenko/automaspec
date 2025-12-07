import { afterEach, vi } from 'vitest'

import { cleanup } from '@testing-library/react'

global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn()
}))

afterEach(() => {
    cleanup()
})

// Mock Next.js router
vi.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: vi.fn(),
            replace: vi.fn(),
            prefetch: vi.fn(),
            back: vi.fn(),
            pathname: '/',
            query: {},
            asPath: '/'
        }
    },
    usePathname() {
        return '/'
    },
    useSearchParams() {
        return new URLSearchParams()
    }
}))

// Mock better-auth
vi.mock('@/lib/shared/better-auth', () => ({
    authClient: {
        useSession: vi.fn(() => ({
            data: null,
            isPending: false,
            error: null
        }))
    }
}))
