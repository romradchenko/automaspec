import { afterEach, vi } from 'vitest'

import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

global.ResizeObserver = vi.fn(function (this: ResizeObserver) {
    this.observe = vi.fn()
    this.unobserve = vi.fn()
    this.disconnect = vi.fn()
}) as unknown as typeof ResizeObserver

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
