import { FileText, ClipboardList, FolderOpen, Users } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MetricsCardsProps {
    totalTests: number
    totalRequirements: number
    totalSpecs: number
    activeMembers: number
}

export function MetricsCards({ totalTests, totalRequirements, totalSpecs, activeMembers }: MetricsCardsProps) {
    const cards = [
        {
            title: 'Total Tests',
            value: totalTests,
            icon: FileText,
            description: 'All tests in organization'
        },
        {
            title: 'Requirements',
            value: totalRequirements,
            icon: ClipboardList,
            description: 'Total requirements defined'
        },
        {
            title: 'Specifications',
            value: totalSpecs,
            icon: FolderOpen,
            description: 'Test specifications'
        },
        {
            title: 'Team Members',
            value: activeMembers,
            icon: Users,
            description: 'Active organization members'
        }
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
                <Card key={card.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                        <card.icon className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                        <p className="text-xs text-muted-foreground">{card.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
