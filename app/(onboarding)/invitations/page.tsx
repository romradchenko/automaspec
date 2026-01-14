'use client'

import { Loader2, Building2, Check, X, Mail, ChevronRight, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import type { Invitation, Organization, User } from '@/lib/types'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { authClient } from '@/lib/shared/better-auth-client'

interface InvitationWithDetails extends Invitation {
    organization: Organization
    inviter: User
}

export default function InvitationsPage() {
    const router = useRouter()
    const [invitations, setInvitations] = useState<InvitationWithDetails[]>([])
    const [processingId, setProcessingId] = useState<string | null>(null)
    const [settingActiveOrgId, setSettingActiveOrgId] = useState<string | null>(null)

    const { data: session, isPending: isPendingSession } = authClient.useSession()
    const { data: activeOrganization, isPending: isPendingActiveOrg } = authClient.useActiveOrganization()
    const {
        data: organizations,
        isPending: isPendingOrganizations,
        refetch: refetchOrganizations
    } = authClient.useListOrganizations()
    const { refetch: refetchActiveOrg } = authClient.useActiveOrganization()

    const handleAcceptInvitation = async (invitationId: string) => {
        setProcessingId(invitationId)
        const { error } = await authClient.organization.acceptInvitation({
            invitationId
        })

        if (error) {
            toast.error(error.message || 'Failed to accept invitation')
            setProcessingId(null)
            return
        }

        toast.success('Invitation accepted successfully!')
        await refetchOrganizations()
        await refetchActiveOrg()
        setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId))
        setProcessingId(null)
    }

    const handleRejectInvitation = async (invitationId: string) => {
        setProcessingId(invitationId)
        const { error } = await authClient.organization.rejectInvitation({
            invitationId
        })

        if (error) {
            toast.error(error.message || 'Failed to reject invitation')
            setProcessingId(null)
            return
        }

        toast.success('Invitation rejected')
        setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId))
        setProcessingId(null)
    }

    const handleSetActiveOrganization = async (orgId: string) => {
        if (settingActiveOrgId !== null) return

        setSettingActiveOrgId(orgId)
        const { error } = await authClient.organization.setActive({
            organizationId: orgId
        })

        if (error) {
            toast.error(error.message || 'Failed to set active organization')
            setSettingActiveOrgId(null)
            return
        }

        await refetchActiveOrg()
        toast.success('Organization activated!')
        router.push('/dashboard')
    }

    const formatExpiryDate = (expiresAt: Date) => {
        const date = new Date(expiresAt)
        const now = new Date()
        const diffHours = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60))

        if (diffHours < 0) {
            return 'Expired'
        }

        if (diffHours < 24) {
            return `Expires in ${diffHours} hours`
        }

        const diffDays = Math.floor(diffHours / 24)
        return `Expires in ${diffDays} days`
    }

    const getRoleBadgeVariant = (role: string) => {
        switch (role.toLowerCase()) {
            case 'owner':
                return 'default'
            case 'admin':
                return 'secondary'
            default:
                return 'outline'
        }
    }

    const isPending = isPendingSession || isPendingActiveOrg || isPendingOrganizations

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="size-8 animate-spin text-primary" />
                    <span className="text-muted-foreground">Loading...</span>
                </div>
            </div>
        )
    }

    if (!session) {
        router.replace('/login')
        return null
    }

    const hasInvitations = invitations.length > 0
    const hasOrganizations = organizations && organizations.length > 0

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4">
            <div className="max-w-3xl mx-auto pt-8 pb-16">
                <div className="text-center mb-10">
                    <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
                        <Sparkles className="size-7 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome, {session.user.name || 'there'}!</h1>
                    <p className="text-muted-foreground mt-2 text-lg">Manage your organizations and invitations</p>
                </div>

                {hasOrganizations && (
                    <section className="mb-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Building2 className="size-5 text-muted-foreground" />
                            <h2 className="text-lg font-semibold">Your Organizations</h2>
                            <Badge variant="secondary" className="ml-auto">
                                {organizations.length}
                            </Badge>
                        </div>

                        <Card>
                            <CardContent className="p-0 divide-y">
                                {organizations.map((org: { id: string; name: string; slug: string }, index: number) => {
                                    const isActive = activeOrganization?.id === org.id
                                    const isSettingActive = settingActiveOrgId === org.id

                                    return (
                                        <div
                                            key={org.id}
                                            className={`flex items-center justify-between p-4 transition-colors ${
                                                index === 0 ? 'rounded-t-lg' : ''
                                            } ${index === organizations.length - 1 ? 'rounded-b-lg' : ''} ${
                                                isActive ? 'bg-primary/5' : 'hover:bg-muted/50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex size-10 items-center justify-center rounded-lg ${
                                                        isActive
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'bg-muted text-muted-foreground'
                                                    }`}
                                                >
                                                    <Building2 className="size-5" />
                                                </div>
                                                <div>
                                                    <div className="font-medium flex items-center gap-2">
                                                        {org.name}
                                                        {isActive && (
                                                            <Badge
                                                                variant="default"
                                                                className="text-xs px-1.5 py-0 h-5"
                                                            >
                                                                Active
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">{org.slug}</div>
                                                </div>
                                            </div>
                                            {isActive ? (
                                                <Button
                                                    size="sm"
                                                    onClick={() => router.push('/dashboard')}
                                                    className="gap-1"
                                                >
                                                    Go to Dashboard
                                                    <ChevronRight className="size-4" />
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => void handleSetActiveOrganization(org.id)}
                                                    disabled={settingActiveOrgId !== null}
                                                >
                                                    {isSettingActive ? (
                                                        <>
                                                            <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                                                            Activating...
                                                        </>
                                                    ) : (
                                                        'Set as Active'
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    )
                                })}
                            </CardContent>
                        </Card>
                    </section>
                )}

                {hasInvitations && (
                    <section className="mb-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Mail className="size-5 text-muted-foreground" />
                            <h2 className="text-lg font-semibold">Pending Invitations</h2>
                            <Badge variant="outline" className="ml-auto">
                                {invitations.length}
                            </Badge>
                        </div>

                        <div className="space-y-3">
                            {invitations.map((invitation) => (
                                <Card key={invitation.id} className="overflow-hidden">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                                    <Building2 className="size-5 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-base">
                                                        {invitation.organization.name}
                                                    </CardTitle>
                                                    <CardDescription className="text-sm">
                                                        Invited by {invitation.inviter.name}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            <Badge variant={getRoleBadgeVariant(invitation.role || 'member')}>
                                                {invitation.role || 'member'}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <Separator />
                                    <CardContent className="pt-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                {formatExpiryDate(invitation.expiresAt)}
                                            </span>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => void handleRejectInvitation(invitation.id)}
                                                    disabled={processingId === invitation.id}
                                                    className="text-muted-foreground hover:text-destructive"
                                                >
                                                    {processingId === invitation.id ? (
                                                        <Loader2 className="size-4 animate-spin" />
                                                    ) : (
                                                        <X className="size-4" />
                                                    )}
                                                    <span className="ml-1.5">Decline</span>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => void handleAcceptInvitation(invitation.id)}
                                                    disabled={processingId === invitation.id}
                                                >
                                                    {processingId === invitation.id ? (
                                                        <Loader2 className="size-4 animate-spin" />
                                                    ) : (
                                                        <Check className="size-4" />
                                                    )}
                                                    <span className="ml-1.5">Accept</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}

                {!hasOrganizations && !hasInvitations && (
                    <Card className="text-center py-12">
                        <CardContent>
                            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                                <Building2 className="size-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">No organizations yet</h3>
                            <p className="text-muted-foreground mb-6">
                                Create your first organization to get started with AutomaSpec
                            </p>
                            <Button onClick={() => router.push('/create-organization')}>
                                <Building2 className="mr-2 size-4" />
                                Create Organization
                            </Button>
                        </CardContent>
                    </Card>
                )}

                <div className="mt-10 text-center">
                    <Separator className="mb-6" />
                    <p className="text-sm text-muted-foreground mb-3">Want to create a new workspace?</p>
                    <Button variant="outline" onClick={() => router.push('/create-organization')}>
                        <Building2 className="mr-2 size-4" />
                        Create New Organization
                    </Button>
                </div>
            </div>
        </div>
    )
}
