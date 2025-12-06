'use client'

import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts'

import type { TestsGrowthItem } from '@/lib/types'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

interface TestsGrowthChartProps {
    testsGrowth: TestsGrowthItem[]
}

const chartConfig = {
    count: {
        label: 'Tests Created',
        color: 'hsl(var(--primary))'
    }
}

export function TestsGrowthChart({ testsGrowth }: TestsGrowthChartProps) {
    const hasData = testsGrowth.length > 0

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tests Growth</CardTitle>
                <CardDescription>New tests created over time</CardDescription>
            </CardHeader>
            <CardContent>
                {hasData ? (
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                        <LineChart data={testsGrowth}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(value) => {
                                    const date = new Date(value)
                                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                }}
                            />
                            <YAxis allowDecimals={false} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="var(--color-count)"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ChartContainer>
                ) : (
                    <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                        No test growth data available for this period
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
