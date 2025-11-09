'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Mail, Calendar } from 'lucide-react'
import Link from 'next/link'
import { authClient } from '@/lib/shared/better-auth'

export default function ProfilePage() {
    const { data: session } = authClient.useSession()
    const { data: activeOrganization } = authClient.useActiveOrganization()

    const userName = session?.user.name || ''
    const userEmail = session?.user.email || ''
    let userInitials = ''
    if (userName) {
        const parts = userName.trim().split(' ')
        for (const p of parts) {
            if (p) userInitials += p[0]
            if (userInitials.length >= 2) break
        }
    }
    if (!userInitials) {
        userInitials = userEmail.slice(0, 2).toUpperCase()
    }
    const joinDate = session?.user.createdAt ? new Date(session.user.createdAt).toLocaleDateString() : ''
    const planKey = activeOrganization?.plan
    const planLabel = planKey ? `${planKey.charAt(0).toUpperCase()}${planKey.slice(1)} Plan` : ''

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-4xl mx-auto py-8 px-4">
                <div className="mb-8">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm" className="mb-4">
                            <ArrowLeft className="mr-2 size-4" />
                            Back to Dashboard
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold">Profile</h1>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                            <Avatar className="size-24">
                                <AvatarImage src={session?.user.image || undefined} alt={userName} />
                                <AvatarFallback className="text-lg">{userInitials || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h2 className="font-bold text-2xl leading-tight">{userName || '—'}</h2>
                                    {planLabel ?
                                        <Badge variant="secondary">{planLabel}</Badge>
                                    :   null}
                                </div>
                                <p className="text-muted-foreground">{userEmail || '—'}</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="flex items-center text-muted-foreground text-sm">
                                <Mail className="mr-2 size-4" /> {userEmail || '—'}
                            </div>
                            <div className="flex items-center text-muted-foreground text-sm">
                                <Calendar className="mr-2 size-4" /> {joinDate || '—'}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
