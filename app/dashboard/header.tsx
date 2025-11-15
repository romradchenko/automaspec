'use client'

import { User, LogOut, Building2, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { safeClient, orpc } from '@/lib/orpc/orpc'
import { authClient } from '@/lib/shared/better-auth'
import { useQueryClient } from '@tanstack/react-query'

export function DashboardHeader() {
    const { data: activeOrganization } = authClient.useActiveOrganization()
    const queryClient = useQueryClient()
    const [isSyncing, setIsSyncing] = useState(false)

    const handleSyncClick = async () => {
        try {
            setIsSyncing(true)

            const { data, error } = await safeClient.tests.syncReport()
            if (error) throw error

            toast.success('Test results synced successfully', {
                description: `Updated: ${data.updated}, Missing: ${data.missing}`
            })

            await Promise.all([
                queryClient.invalidateQueries({ queryKey: orpc.tests.key({ type: 'query' }) }),
                queryClient.invalidateQueries({ queryKey: orpc.testSpecs.key({ type: 'query' }) })
            ])
        } catch (error) {
            toast.error('Failed to sync test results', {
                description: error instanceof Error ? error.message : 'Unknown error'
            })
        } finally {
            setIsSyncing(false)
        }
    }

    return (
        <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <h1 className="font-semibold text-lg">{activeOrganization?.name}</h1>
                </div>
                <Badge variant="secondary">Free Plan</Badge>
            </div>
            <div className="flex items-center gap-2">
                <Button onClick={handleSyncClick} size="sm" variant="outline" disabled={isSyncing}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    Sync Tests
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                            <User className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href="/profile">
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/login" onClick={() => authClient.signOut()}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
