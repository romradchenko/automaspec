'use client'

import { Loader2, Building2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authClient } from '@/lib/shared/better-auth-client'

export default function ChooseOrganizationPage() {
    const router = useRouter()
    const [activatingOrgId, setActivatingOrgId] = useState<string | null>(null)
    const hasRefetchedRef = useRef(false)
    const previousSessionUserIdRef = useRef<string | null>(null)
    const isRedirectingRef = useRef(false)
    const { data: session, isPending: isPendingSession } = authClient.useSession()
    const { data: organizations, isPending, error, refetch } = authClient.useListOrganizations()
    const { refetch: refetchActiveOrg } = authClient.useActiveOrganization()

    useEffect(() => {
        if (isPendingSession) return
        if (activatingOrgId !== null) return
        if (isRedirectingRef.current) return

        if (!session) {
            previousSessionUserIdRef.current = null
            hasRefetchedRef.current = false
            router.push('/login')
            return
        }

        const currentUserId = session.user.id
        if (previousSessionUserIdRef.current !== currentUserId) {
            previousSessionUserIdRef.current = currentUserId
            hasRefetchedRef.current = false
            void refetch()
        } else if (!hasRefetchedRef.current && !isPending) {
            hasRefetchedRef.current = true
            if (error) {
                void refetch()
            }
        }
    }, [session, isPendingSession, isPending, error, router, refetch, activatingOrgId])

    useEffect(() => {
        if (isPending || isPendingSession) return
    }, [isPending, isPendingSession])

    const handleSetActiveOrganization = async (orgId: string) => {
        isRedirectingRef.current = false
        setActivatingOrgId(orgId)
        const { data, error } = await authClient.organization.setActive({
            organizationId: orgId
        })

        if (error) {
            setActivatingOrgId(null)
            toast.error(error.message || 'Failed to set active organization')
            router.push('/create-organization')
        } else {
            await refetchActiveOrg()
            toast.success(`Organization ${data.name} set as active successfully!`)
            isRedirectingRef.current = true
            router.replace('/dashboard')
            setActivatingOrgId(null)
        }
    }

    if ((isPendingSession || !session) && activatingOrgId === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Checking authentication...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            {isPending ? (
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Checking your organizations...</p>
                </div>
            ) : (
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                            <Building2 className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <CardTitle>Choose Your Organization</CardTitle>
                        <CardDescription>Select the workspace you want to use</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error ? (
                            <div className="space-y-4">
                                <p className="text-sm text-destructive mb-4">
                                    {error.message || 'Failed to load organizations'}
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => router.push('/create-organization')}
                                    className="w-full"
                                >
                                    Create Organization
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-3">
                                    {organizations &&
                                    organizations.length > 0 &&
                                    session &&
                                    previousSessionUserIdRef.current === session.user.id ? (
                                        // TODO: use Organization type when better-auth fixes its authClient types
                                        organizations.map((org: { id: string; name: string; slug: string }) => (
                                            <div
                                                key={org.id}
                                                className="flex items-center justify-between p-3 rounded border"
                                            >
                                                <div>
                                                    <div className="font-medium">{org.name}</div>
                                                    <div className="text-xs text-muted-foreground">{org.slug}</div>
                                                </div>
                                                <Button
                                                    onClick={async () => handleSetActiveOrganization(org.id)}
                                                    disabled={activatingOrgId !== null}
                                                >
                                                    {activatingOrgId === org.id ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Setting...
                                                        </>
                                                    ) : (
                                                        'Set as active'
                                                    )}
                                                </Button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No organizations available.</p>
                                    )}
                                </div>

                                <div className="mt-6 text-center">
                                    <Button
                                        variant="outline"
                                        onClick={() => router.push('/create-organization')}
                                        className="w-full"
                                    >
                                        Create New Organization
                                    </Button>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
