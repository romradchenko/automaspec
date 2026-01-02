'use client'

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { STATUS_CONFIGS } from '@/lib/constants'

interface StatusDistributionChartProps {
    testsByStatus: Record<string, number>
}

const statusColors: Record<string, string> = {
    passed: 'hsl(142, 76%, 36%)',
    failed: 'hsl(0, 84%, 60%)',
    pending: 'hsl(45, 93%, 47%)',
    skipped: 'hsl(215, 14%, 50%)',
    todo: 'hsl(24, 95%, 53%)',
    disabled: 'hsl(215, 14%, 50%)',
    missing: 'hsl(215, 14%, 50%)'
}

export function StatusDistributionChart({ testsByStatus }: StatusDistributionChartProps) {
    const chartData = Object.entries(testsByStatus)
        .filter(([_, count]) => count > 0)
        .map(([status, count]) => ({
            status: STATUS_CONFIGS[status as keyof typeof STATUS_CONFIGS]?.label || status,
            count,
            fill: statusColors[status] || 'hsl(var(--muted))'
        }))

    const chartConfig = Object.fromEntries(
        chartData.map((item) => [item.status.toLowerCase(), { label: item.status, color: item.fill }])
    )

    const hasData = chartData.length > 0

    return (
        <Card>
            <CardHeader>
                <CardTitle>Test Status Distribution</CardTitle>
                <CardDescription>Tests grouped by their current status</CardDescription>
            </CardHeader>
            <CardContent>
                {hasData ? (
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                        <BarChart data={chartData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" allowDecimals={false} />
                            <YAxis dataKey="status" type="category" width={80} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="count" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ChartContainer>
                ) : (
                    <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                        No test status data available
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
