'use client'

import { useState } from 'react'

import type { AnalyticsPeriod } from '@/lib/types'

import Loader from '@/components/loader'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { orpc } from '@/lib/orpc/orpc'
import { useQuery } from '@tanstack/react-query'

import { AnalyticsHeader } from './components/analytics-header'
import { MetricsCards } from './components/metrics-cards'
import { StaleTestsTable } from './components/stale-tests-table'
import { StatusDistributionChart } from './components/status-distribution-chart'
import { TestsGrowthChart } from './components/tests-growth-chart'

export default function AnalyticsPage() {
    const [period, setPeriod] = useState<AnalyticsPeriod>('30d')

    const { data, isLoading, error } = useQuery(orpc.analytics.getMetrics.queryOptions({ input: { period } }))

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-destructive">Failed to load analytics</h2>
                    <p className="text-muted-foreground">{error.message}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col">
            <AnalyticsHeader />
            <main className="flex-1 p-6">
                <div className="mx-auto max-w-7xl space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
                        <Tabs value={period} onValueChange={(v) => setPeriod(v as AnalyticsPeriod)}>
                            <TabsList>
                                <TabsTrigger value="7d">7 Days</TabsTrigger>
                                <TabsTrigger value="30d">30 Days</TabsTrigger>
                                <TabsTrigger value="90d">90 Days</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {data && (
                        <>
                            <MetricsCards
                                totalTests={data.totalTests}
                                totalRequirements={data.totalRequirements}
                                totalSpecs={data.totalSpecs}
                                activeMembers={data.activeMembers}
                            />

                            <div className="grid gap-6 md:grid-cols-2">
                                <TestsGrowthChart testsGrowth={data.testsGrowth} />
                                <StatusDistributionChart testsByStatus={data.testsByStatus} />
                            </div>

                            <StaleTestsTable staleTests={data.staleTests} period={period} />
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}
