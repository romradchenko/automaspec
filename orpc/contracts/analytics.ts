import { oc } from '@orpc/contract'

import { analyticsMetricsInputSchema, analyticsMetricsOutputSchema } from '@/lib/types'

const getMetricsContract = oc
    .route({
        method: 'GET',
        path: '/analytics/metrics',
        tags: ['analytics'],
        description: 'Get analytics metrics for the organization'
    })
    .input(analyticsMetricsInputSchema)
    .output(analyticsMetricsOutputSchema)

export const analyticsContract = {
    analytics: {
        getMetrics: getMetricsContract
    }
}
