'use client'

import { User, LogOut, Building2, BarChart3 } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { authClient } from '@/lib/shared/better-auth-client'

export function DashboardHeader() {
    const { data: activeOrganization } = authClient.useActiveOrganization()

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
                <Button asChild size="sm" variant="outline" className="flex-1 sm:flex-initial">
                    <Link href="/analytics">
                        <BarChart3 className="mr-2 size-4" />
                        <span className="hidden sm:inline">Analytics</span>
                        <span className="sm:hidden">Stats</span>
                    </Link>
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
