'use client'

import { Loader2, Building2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef, useState, useEffect } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authClient } from '@/lib/shared/better-auth-client'

export default function ChooseOrganizationPage() {
    const router = useRouter()
    const [activatingOrgId, setActivatingOrgId] = useState<string | null>(null)
    const [isInitialized, setIsInitialized] = useState(false)
    const isRedirectingRef = useRef(false)
    const previousUserIdRef = useRef<string | null>(null)

    const { data: session, isPending: isPendingSession } = authClient.useSession()
    const {
        data: organizations,
        isPending: isPendingOrganizations,
        error,
        refetch: refetchOrganizations
    } = authClient.useListOrganizations()
    const { refetch: refetchActiveOrg } = authClient.useActiveOrganization()

    useEffect(() => {
        if (isPendingSession || !session?.user?.id) return

        const currentUserId = session.user.id
        const userChanged = previousUserIdRef.current !== null && previousUserIdRef.current !== currentUserId
        const isFirstLoad = previousUserIdRef.current === null

        previousUserIdRef.current = currentUserId

        if (userChanged || isFirstLoad) {
            setIsInitialized(false)
            void refetchOrganizations().then(() => {
                setIsInitialized(true)
            })
        }
    }, [session?.user?.id, isPendingSession, refetchOrganizations])

    useEffect(() => {
        if (isPendingSession) return
        if (!session) {
            router.replace('/login')
            return
        }

        if (!isInitialized || isPendingOrganizations || isRedirectingRef.current) return

        if (!organizations || organizations.length === 0) {
            isRedirectingRef.current = true
            router.replace('/create-organization')
        }
    }, [isPendingSession, session, isInitialized, isPendingOrganizations, organizations, router])

    const handleSetActiveOrganization = async (orgId: string) => {
        if (isRedirectingRef.current || activatingOrgId !== null) return

        setActivatingOrgId(orgId)

        const { data, error: setActiveError } = await authClient.organization.setActive({
            organizationId: orgId
        })

        if (setActiveError) {
            setActivatingOrgId(null)
            toast.error(setActiveError.message || 'Failed to set active organization')
            return
        }

        isRedirectingRef.current = true
        await refetchActiveOrg()
        toast.success(`Organization ${data.name} set as active successfully!`)
        router.replace('/dashboard')
    }

    if (isPendingSession) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="size-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Checking authentication...</p>
                </div>
            </div>
        )
    }

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="size-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Redirecting...</p>
                </div>
            </div>
        )
    }

    if (!isInitialized || isPendingOrganizations) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="size-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading organizations...</p>
                </div>
            </div>
        )
    }

    if (!organizations || organizations.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="size-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Redirecting...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-lg bg-primary">
                        <Building2 className="size-6 text-primary-foreground" />
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
                                {organizations.map((org: { id: string; name: string; slug: string }) => (
                                    <div key={org.id} className="flex items-center justify-between p-3 rounded border">
                                        <div>
                                            <div className="font-medium">{org.name}</div>
                                            <div className="text-xs text-muted-foreground">{org.slug}</div>
                                        </div>
                                        <Button
                                            onClick={() => void handleSetActiveOrganization(org.id)}
                                            disabled={activatingOrgId !== null}
                                        >
                                            {activatingOrgId === org.id ? (
                                                <>
                                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                                    Setting...
                                                </>
                                            ) : (
                                                'Set as active'
                                            )}
                                        </Button>
                                    </div>
                                ))}
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
        </div>
    )
}
