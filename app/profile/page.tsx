'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowLeft, Mail, Calendar, Building2, LogOut, AlertTriangle, Download, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/shared/better-auth'
import { ModeToggle } from '@/components/theme-toggler'
import { client } from '@/lib/orpc/orpc'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog'

export default function ProfilePage() {
    const router = useRouter()
    const { data: session } = authClient.useSession()
    const { data: activeOrganization } = authClient.useActiveOrganization()
    const [confirmOpen, setConfirmOpen] = useState(false)

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

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-4xl mx-auto py-8 px-4">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="mr-2 size-4" />
                                Back to Dashboard
                            </Button>
                        </Link>
                    </div>
                    <h1 className="mt-4 text-3xl font-bold">Profile</h1>
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

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Building2 className="size-5" />
                                <CardTitle>Organization</CardTitle>
                            </div>
                            <CardDescription>Active organization and plan</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="font-medium">{activeOrganization?.name || '—'}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Download className="size-5" />
                                <CardTitle>Preferences & Data</CardTitle>
                            </div>
                            <CardDescription>Appearance and data access</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-base">Theme</div>
                                <ModeToggle />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-base">Export my data (JSON)</div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={async () => {
                                        const data = await client.account.export()
                                        const blob = new Blob([JSON.stringify(data, null, 2)], {
                                            type: 'application/json'
                                        })
                                        const url = URL.createObjectURL(blob)
                                        const a = document.createElement('a')
                                        a.href = url
                                        a.download = `automaspec-export-${new Date().toISOString().slice(0, 10)}.json`
                                        document.body.appendChild(a)
                                        a.click()
                                        a.remove()
                                        URL.revokeObjectURL(url)
                                    }}
                                >
                                    <Download className="mr-2 size-4" /> Export
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <LogOut className="size-5" />
                                <CardTitle>Session</CardTitle>
                            </div>
                            <CardDescription>Manage your current session</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                variant="outline"
                                onClick={async () => {
                                    await authClient.signOut()
                                    router.push('/login')
                                }}
                            >
                                <LogOut className="mr-2 size-4" /> Sign out
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-red-200">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="size-5 text-red-600" />
                                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                            </div>
                            <CardDescription>Permanently remove your account and data</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4">
                                <div>
                                    <div className="font-medium text-red-800">Delete Account</div>
                                    <div className="text-sm text-red-600">This action cannot be undone</div>
                                </div>
                                <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
                                    <Trash2 className="mr-2 size-4" /> Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete account</AlertDialogTitle>
                            <AlertDialogDescription>
                                This removes your user and associated data. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={async () => {
                                    try {
                                        await client.account.delete()
                                    } finally {
                                        router.push('/login')
                                    }
                                }}
                            >
                                Confirm
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}
