'use client'

import { Loader2, Building2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authClient } from '@/lib/shared/better-auth-client'

export default function ChooseOrganizationPage() {
    const router = useRouter()
    const { data: organizations, isPending, error } = authClient.useListOrganizations()

    useEffect(() => {
        if (organizations && organizations.length === 0) {
            toast.error('No organizations available. Please create an organization first.')
            router.push('/create-organization')
        }
    }, [organizations, router])

    const handleSetActiveOrganization = async (orgId: string) => {
        const { data, error } = await authClient.organization.setActive({
            organizationId: orgId
        })

        if (error) {
            toast.error(error.message || 'Failed to set active organization')
            router.push('/create-organization')
        } else {
            toast.success(`Organization ${data.name} set as active successfully!`)
            window.location.href = '/dashboard'
        }
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
                        {error && <p className="text-sm text-destructive mb-4">{error.message}</p>}

                        <div className="space-y-3">
                            {organizations && organizations.length > 0 ? (
                                // TODO: use Organization type when better-auth fixes its authClient types
                                organizations.map((org: { id: string; name: string; slug: string }) => (
                                    <div key={org.id} className="flex items-center justify-between p-3 rounded border">
                                        <div>
                                            <div className="font-medium">{org.name}</div>
                                            <div className="text-xs text-muted-foreground">{org.slug}</div>
                                        </div>
                                        <Button onClick={() => handleSetActiveOrganization(org.id)}>
                                            Set as active
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
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
