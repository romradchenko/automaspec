'use client'

import { User, LogOut, Building2, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { safeClient, orpc } from '@/lib/orpc/orpc'
import { authClient } from '@/lib/shared/better-auth-client'
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
        <div className="flex flex-col gap-3 border-b border-primary/20 p-4 sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-background to-primary/5">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                    <Building2 className="size-5 text-primary" />
                    <h1 className="font-semibold text-base sm:text-lg text-foreground">{activeOrganization?.name}</h1>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    Free Plan
                </Badge>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    onClick={handleSyncClick}
                    size="sm"
                    variant="outline"
                    disabled={isSyncing}
                    className="flex-1 sm:flex-initial"
                >
                    <RefreshCw className={`mr-2 size-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Sync Tests</span>
                    <span className="sm:hidden">Sync</span>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                            <User className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href="/profile">
                                <User className="mr-2 size-4" />
                                Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/login" onClick={() => authClient.signOut()}>
                                <LogOut className="mr-2 size-4" />
                                Logout
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
