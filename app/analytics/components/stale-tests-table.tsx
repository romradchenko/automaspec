import { formatDistanceToNow } from 'date-fns'
import { AlertTriangle } from 'lucide-react'

import type { AnalyticsPeriod, StaleTest } from '@/lib/types'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ANALYTICS_PERIODS } from '@/lib/constants'

interface StaleTestsTableProps {
    staleTests: StaleTest[]
    period: AnalyticsPeriod
}

export function StaleTestsTable({ staleTests, period }: StaleTestsTableProps) {
    const days = ANALYTICS_PERIODS[period]
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <AlertTriangle className="size-5 text-amber-500" />
                    <CardTitle>Stale Tests</CardTitle>
                </div>
                <CardDescription>Specifications not updated in the last {days} days</CardDescription>
            </CardHeader>
            <CardContent>
                {staleTests.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Specification Name</TableHead>
                                <TableHead className="text-right">Last Updated</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {staleTests.map((spec) => (
                                <TableRow key={spec.id}>
                                    <TableCell className="font-medium">{spec.name}</TableCell>
                                    <TableCell className="text-right text-muted-foreground">
                                        {formatDistanceToNow(new Date(spec.updatedAt), { addSuffix: true })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="text-muted-foreground">No stale tests found</div>
                        <p className="text-sm text-muted-foreground/70">
                            All specifications have been updated within the last {days} days
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
