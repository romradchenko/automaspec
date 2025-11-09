'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Mail, Calendar } from 'lucide-react'
import Link from 'next/link'
import { authClient } from '@/lib/shared/better-auth'

export default function ProfilePage() {
    const { data: session } = authClient.useSession()
    const { data: activeOrganization } = authClient.useActiveOrganization()

    const userName = session?.user.name || ''
    const userEmail = session?.user.email || ''
    const userInitials =
        userName ?
            userName
                .split(' ')
                .map((n) => n[0])
                .join('')
        :   userEmail.slice(0, 2).toUpperCase()
    const joinDate = session?.user.createdAt ? new Date(session.user.createdAt).toLocaleDateString() : ''
    const planKey = activeOrganization?.plan
    const planLabel = planKey ? `${planKey.charAt(0).toUpperCase()}${planKey.slice(1)} Plan` : ''

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-4xl mx-auto py-8 px-4">
                <div className="mb-8">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm" className="mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold">Profile</h1>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row gap-6">
                                <div className="relative">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src={session?.user.image || undefined} alt={userName} />
                                        <AvatarFallback className="text-lg">{userInitials || 'U'}</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-2xl font-bold">{userName || '—'}</h2>
                                            <p className="text-muted-foreground">{userEmail || '—'}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Mail className="mr-2 h-4 w-4" /> {userEmail || '—'}
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Calendar className="mr-2 h-4 w-4" /> {joinDate || '—'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" value={userName} disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={userEmail} disabled />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Plan & Billing</CardTitle>
                            <CardDescription>Manage your subscription and billing information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold">Current Plan</h3>
                                        <Badge variant="secondary">{planLabel || '—'}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Access to basic features and limited test suites
                                    </p>
                                </div>
                                <Button variant="outline">Upgrade Plan</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
