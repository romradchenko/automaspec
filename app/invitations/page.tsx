'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Loader2, Building2, Check, X, Mail } from 'lucide-react'
import { authClient } from '@/lib/shared/better-auth'
import { toast } from 'sonner'

import type { Invitation, Organization, User } from '@/lib/types'

interface InvitationWithDetails extends Invitation {
    organization: Organization
    inviter: User
}

export default function InvitationsPage() {
    const router = useRouter()
    const [invitations, setInvitations] = useState<InvitationWithDetails[]>([])
    const [processingId, setProcessingId] = useState<string | null>(null)
    const { data: activeOrganization, isPending, error } = authClient.useActiveOrganization()

    useEffect(() => {
        if (activeOrganization) router.push('/dashboard')
        else router.push('/create-organization')
    }, [activeOrganization, router])

    // TODO: refactor this
    const handleAcceptInvitation = async (invitationId: string) => {
        setProcessingId(invitationId)
        try {
            const { error } = await authClient.organization.acceptInvitation({
                invitationId
            })

            if (error) {
                toast.error(error.message || 'Failed to accept invitation')
                return
            }

            toast.success('Invitation accepted successfully!')
            router.push('/dashboard')
        } catch (err) {
            toast.error('An unexpected error occurred')
            console.error('Accept invitation error:', err)
        } finally {
            setProcessingId(null)
        }
    }

    const handleRejectInvitation = async (invitationId: string) => {
        setProcessingId(invitationId)
        try {
            const { error } = await authClient.organization.rejectInvitation({
                invitationId
            })

            if (error) {
                toast.error(error.message || 'Failed to reject invitation')
                return
            }

            toast.success('Invitation rejected')
            // Remove from local state
            setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId))

            // If no more invitations, redirect to create organization
            const remainingInvitations = invitations.filter((inv) => inv.id !== invitationId)
            if (remainingInvitations.length === 0) {
                router.push('/create-organization')
            }
        } catch (err) {
            toast.error('An unexpected error occurred')
            console.error('Reject invitation error:', err)
        } finally {
            setProcessingId(null)
        }
    }

    const formatExpiryDate = (expiresAt: Date) => {
        const date = new Date(expiresAt)
        const now = new Date()
        const diffHours = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60))

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

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Loading invitations...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background p-4">
            <div className="max-w-2xl mx-auto pt-8">
                <div className="text-center mb-8">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                        <Mail className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold">Organization Invitations</h1>
                    <p className="text-muted-foreground mt-2">
                        You have been invited to join {invitations.length} organization
                        {invitations.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertDescription>{error.message}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-4">
                    {invitations.map((invitation) => (
                        <Card key={invitation.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <Building2 className="h-8 w-8 text-muted-foreground" />
                                        <div>
                                            <CardTitle className="text-lg">{invitation.organization.name}</CardTitle>
                                            <CardDescription>
                                                Invited by {invitation.inviter.name} ({invitation.inviter.email})
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Badge variant={getRoleBadgeVariant(invitation.role || 'member')}>
                                        {invitation.role || 'member'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground">
                                        {formatExpiryDate(invitation.expiresAt)}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleRejectInvitation(invitation.id)}
                                            disabled={processingId === invitation.id}
                                        >
                                            {processingId === invitation.id ?
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            :   <X className="mr-2 h-4 w-4" />}
                                            Decline
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => handleAcceptInvitation(invitation.id)}
                                            disabled={processingId === invitation.id}
                                        >
                                            {processingId === invitation.id ?
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            :   <Check className="mr-2 h-4 w-4" />}
                                            Accept
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground mb-4">Don't want to join any of these organizations?</p>
                    <Button variant="outline" onClick={() => router.push('/create-organization')}>
                        <Building2 className="mr-2 h-4 w-4" />
                        Create Your Own Organization
                    </Button>
                </div>
            </div>
        </div>
    )
}
