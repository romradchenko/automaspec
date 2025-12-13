import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'

vi.mock('@/lib/shared/better-auth-client', () => ({
    authClient: {
        useActiveOrganization: () => ({ data: { id: 'org-1', name: 'Test Org' } })
    }
}))

vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: vi.fn() }),
    useSearchParams: () => new URLSearchParams()
}))

const mockMetrics = {
    totalTests: 25,
    totalRequirements: 15,
    totalSpecs: 8,
    activeMembers: 3,
    testsByStatus: {
        passed: 18,
        failed: 4,
        pending: 2,
        skipped: 1,
        todo: 0,
        disabled: 0,
        missing: 0
    },
    testsGrowth: [
        { date: '2024-01-01', count: 5 },
        { date: '2024-01-02', count: 8 },
        { date: '2024-01-03', count: 12 }
    ],
    staleTests: [{ id: 'spec-1', name: 'Old Auth Tests', updatedAt: '2024-01-01' }]
}

vi.mock('@/lib/orpc/orpc', () => ({
    orpc: {
        analytics: {
            getMetrics: {
                useQuery: () => ({
                    data: mockMetrics,
                    isLoading: false,
                    error: null
                })
            }
        }
    },
    safeClient: {
        analytics: {
            getMetrics: vi.fn().mockResolvedValue({ data: mockMetrics, error: null })
        }
    }
}))

describe('Analytics Page Components', () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false }
        }
    })

    const renderWithProviders = (component: React.ReactElement) => {
        return render(<QueryClientProvider client={queryClient}>{component}</QueryClientProvider>)
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders metrics cards with correct values', async () => {
        const { MetricsCards } = await import('@/app/analytics/components/metrics-cards')
        renderWithProviders(
            <MetricsCards
                totalTests={mockMetrics.totalTests}
                totalRequirements={mockMetrics.totalRequirements}
                totalSpecs={mockMetrics.totalSpecs}
                activeMembers={mockMetrics.activeMembers}
            />
        )

        expect(screen.getByText('25')).toBeDefined()
        expect(screen.getByText('15')).toBeDefined()
        expect(screen.getByText('8')).toBeDefined()
        expect(screen.getByText('3')).toBeDefined()
    })

    it('renders status distribution chart with data', async () => {
        const { StatusDistributionChart } = await import('@/app/analytics/components/status-distribution-chart')
        renderWithProviders(<StatusDistributionChart testsByStatus={mockMetrics.testsByStatus} />)

        expect(screen.getByText('Test Status Distribution')).toBeDefined()
    })

    it('renders tests growth chart with data', async () => {
        const { TestsGrowthChart } = await import('@/app/analytics/components/tests-growth-chart')
        renderWithProviders(<TestsGrowthChart testsGrowth={mockMetrics.testsGrowth} />)

        expect(screen.getByText('Tests Growth')).toBeDefined()
    })

    it('renders stale tests table with items', async () => {
        const { StaleTestsTable } = await import('@/app/analytics/components/stale-tests-table')
        renderWithProviders(<StaleTestsTable staleTests={mockMetrics.staleTests} period="30d" />)

        expect(screen.getByText('Stale Tests')).toBeDefined()
        expect(screen.getByText('Old Auth Tests')).toBeDefined()
    })

    it('displays empty state when no stale tests', async () => {
        const { StaleTestsTable } = await import('@/app/analytics/components/stale-tests-table')
        renderWithProviders(<StaleTestsTable staleTests={[]} period="30d" />)

        expect(screen.getByText('No stale tests found')).toBeDefined()
    })
})
