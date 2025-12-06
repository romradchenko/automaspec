import { sql, eq, and, lt, count } from 'drizzle-orm'

import type { AnalyticsPeriod, TestsGrowthItem, StaleTest, SpecStatus } from '@/lib/types'

import { db } from '@/db'
import { testSpec, testRequirement, test, member } from '@/db/schema'
import { ANALYTICS_PERIODS, STALE_THRESHOLD_DAYS, SPEC_STATUSES } from '@/lib/constants'
import { analyticsContract } from '@/orpc/contracts/analytics'
import { authMiddleware, organizationMiddleware } from '@/orpc/middleware'
import { implement } from '@orpc/server'

const os = implement(analyticsContract).use(authMiddleware).use(organizationMiddleware)

const getMetrics = os.analytics.getMetrics.handler(async ({ input, context }) => {
    const period = input.period as AnalyticsPeriod
    const days = ANALYTICS_PERIODS[period]
    const periodStart = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    const staleThreshold = new Date(Date.now() - STALE_THRESHOLD_DAYS * 24 * 60 * 60 * 1000)

    const specsResult = await db
        .select({ count: count() })
        .from(testSpec)
        .where(eq(testSpec.organizationId, context.organizationId))

    const specs = await db
        .select({
            id: testSpec.id,
            name: testSpec.name,
            statuses: testSpec.statuses,
            updatedAt: testSpec.updatedAt
        })
        .from(testSpec)
        .where(eq(testSpec.organizationId, context.organizationId))

    const requirementsResult = await db
        .select({ count: count() })
        .from(testRequirement)
        .innerJoin(testSpec, eq(testRequirement.specId, testSpec.id))
        .where(eq(testSpec.organizationId, context.organizationId))

    const testsResult = await db
        .select({ count: count() })
        .from(test)
        .innerJoin(testRequirement, eq(test.requirementId, testRequirement.id))
        .innerJoin(testSpec, eq(testRequirement.specId, testSpec.id))
        .where(eq(testSpec.organizationId, context.organizationId))

    const membersResult = await db
        .select({ count: count() })
        .from(member)
        .where(eq(member.organizationId, context.organizationId))

    const testsByStatus: Record<string, number> = {}
    for (const status of Object.values(SPEC_STATUSES)) {
        testsByStatus[status] = 0
    }

    for (const spec of specs) {
        if (spec.statuses) {
            for (const [status, statusCount] of Object.entries(spec.statuses)) {
                testsByStatus[status] = (testsByStatus[status] || 0) + (statusCount as number)
            }
        }
    }

    const testsWithDates = await db
        .select({
            createdAt: test.createdAt
        })
        .from(test)
        .innerJoin(testRequirement, eq(test.requirementId, testRequirement.id))
        .innerJoin(testSpec, eq(testRequirement.specId, testSpec.id))
        .where(
            and(
                eq(testSpec.organizationId, context.organizationId),
                sql`${test.createdAt} >= ${periodStart.toISOString()}`
            )
        )

    const growthMap: Record<string, number> = {}
    for (const t of testsWithDates) {
        const date = t.createdAt.split('T')[0]
        growthMap[date] = (growthMap[date] || 0) + 1
    }

    const testsGrowth: TestsGrowthItem[] = Object.entries(growthMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, testCount]) => ({ date, count: testCount }))

    const staleTests: StaleTest[] = specs
        .filter((spec) => new Date(spec.updatedAt) < staleThreshold)
        .map((spec) => ({
            id: spec.id,
            name: spec.name,
            updatedAt: spec.updatedAt
        }))

    return {
        totalTests: testsResult[0]?.count || 0,
        totalRequirements: requirementsResult[0]?.count || 0,
        totalSpecs: specsResult[0]?.count || 0,
        activeMembers: membersResult[0]?.count || 0,
        testsByStatus,
        testsGrowth,
        staleTests
    }
})

export const analyticsRouter = {
    analytics: {
        getMetrics
    }
}
