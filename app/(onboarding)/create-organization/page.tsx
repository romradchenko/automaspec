'use client'

import { useForm } from '@tanstack/react-form'
import { Loader2, Building2, Info } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authClient } from '@/lib/shared/better-auth-client'

export default function CreateOrganizationPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isInitialized, setIsInitialized] = useState(false)
    const previousUserIdRef = useRef<string | null>(null)

    const { data: session, isPending: isPendingSession } = authClient.useSession()
    const {
        data: activeOrganization,
        isPending: isPendingActiveOrganization,
        refetch: refetchActiveOrg
    } = authClient.useActiveOrganization()
    const {
        data: organizations,
        isPending: isPendingOrganizations,
        refetch: refetchOrganizations
    } = authClient.useListOrganizations()

    useEffect(() => {
        if (isPendingSession || !session?.user?.id) return

        const currentUserId = session.user.id
        const userChanged = previousUserIdRef.current !== null && previousUserIdRef.current !== currentUserId
        const isFirstLoad = previousUserIdRef.current === null

        previousUserIdRef.current = currentUserId

        if (userChanged || isFirstLoad) {
            setIsInitialized(false)
            void Promise.all([refetchOrganizations(), refetchActiveOrg()]).then(() => {
                setIsInitialized(true)
            })
        }
    }, [session?.user?.id, isPendingSession, refetchOrganizations, refetchActiveOrg])

    const form = useForm({
        defaultValues: {
            name: '',
            slug: ''
        },
        onSubmit: async ({ value }) => {
            setIsSubmitting(true)
            const { data: createdOrg, error: createError } = await authClient.organization.create({
                name: value.name,
                slug: value.slug
            })

            if (createError) {
                toast.error(createError.message || 'Failed to create organization')
                setIsSubmitting(false)
                return
            }

            const { error: setActiveError } = await authClient.organization.setActive({
                organizationId: createdOrg.id
            })

            if (setActiveError) {
                toast.error(setActiveError.message || 'Failed to set active organization')
                setIsSubmitting(false)
                return
            }

            await refetchActiveOrg()
            toast.success('Organization created successfully!')
            router.push('/onboarding')
        }
    })

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
    }

    const isPending = isPendingSession || isPendingActiveOrganization || isPendingOrganizations || !isInitialized

    if (isPending || isSubmitting) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="size-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">{isSubmitting ? 'Creating organization...' : 'Loading...'}</p>
                </div>
            </div>
        )
    }

    if (!session) {
        router.replace('/login')
        return null
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-lg bg-primary">
                        <Building2 className="size-6 text-primary-foreground" />
                    </div>
                    <CardTitle>Create Your Organization</CardTitle>
                    <CardDescription>Set up your workspace to get started with AutomaSpec</CardDescription>
                </CardHeader>
                <CardContent>
                    {organizations && organizations.length > 0 && (
                        <Alert variant="info" className="mb-6">
                            <Info className="size-4" />
                            <AlertTitle>Already part of an organization</AlertTitle>
                            <AlertDescription className="mt-2">
                                {activeOrganization ? (
                                    <div className="space-y-2">
                                        <p>
                                            You are currently using <strong>{activeOrganization.name}</strong>
                                            {organizations.length > 1 && (
                                                <> and have {organizations.length} organizations total</>
                                            )}
                                            .
                                        </p>
                                        <p className="flex items-center gap-2 flex-wrap">
                                            <span>Want to switch?</span>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => router.push('/choose-organization')}
                                                className="text-xs"
                                            >
                                                View all organizations
                                            </Button>
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <p>
                                            You are already part of {organizations.length}{' '}
                                            {organizations.length === 1 ? 'organization' : 'organizations'}.
                                        </p>
                                        <p className="flex items-center gap-2 flex-wrap">
                                            <span>Want to use an existing one?</span>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => router.push('/choose-organization')}
                                                className="text-xs"
                                            >
                                                Choose organization
                                            </Button>
                                        </p>
                                    </div>
                                )}
                            </AlertDescription>
                        </Alert>
                    )}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            void form.handleSubmit()
                        }}
                        className="space-y-4"
                    >
                        <form.Field
                            name="name"
                            validators={{
                                onChangeAsyncDebounceMs: 500,
                                onChangeAsync: async ({ value }) => {
                                    if (!value) return 'Organization name is required'
                                    if (value.length < 2) return 'Name must be at least 2 characters'
                                    if (value.length > 50) return 'Name must be less than 50 characters'
                                }
                            }}
                        >
                            {(field) => (
                                <div className="space-y-2">
                                    <Label htmlFor="name">Organization Name</Label>
                                    <Input
                                        id="name"
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => {
                                            field.handleChange(e.target.value)
                                            const slug = generateSlug(e.target.value)
                                            form.setFieldValue('slug', slug)
                                        }}
                                        placeholder="Acme Inc."
                                    />
                                    {field.state.meta.errors && (
                                        <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
                                    )}
                                </div>
                            )}
                        </form.Field>

                        <form.Field
                            name="slug"
                            validators={{
                                onChange: ({ value }) => (!value ? 'Organization slug is required' : undefined),
                                onChangeAsyncDebounceMs: 500,
                                onChangeAsync: async ({ value }) => {
                                    if (!value) return 'Organization slug is required'
                                    if (value.length < 2) return 'Slug must be at least 2 characters'
                                    if (value.length > 50) return 'Slug must be less than 50 characters'
                                    if (!/^[a-z0-9-]+$/.test(value)) {
                                        return 'Slug can only contain lowercase letters, numbers, and hyphens'
                                    }

                                    try {
                                        const result = await authClient.organization.checkSlug({
                                            slug: value
                                        })
                                        if (result.error || !result.data?.status) {
                                            return 'This slug is already taken'
                                        }
                                    } catch (err) {
                                        console.log(err)
                                    }
                                }
                            }}
                        >
                            {(field) => (
                                <div className="space-y-2">
                                    <Label htmlFor="slug">Organization Slug</Label>
                                    <Input
                                        id="slug"
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="acme-inc"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Used in URLs: automaspec.com/{field.state.value || 'your-slug'}
                                    </p>
                                    {field.state.meta.errors && (
                                        <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
                                    )}
                                </div>
                            )}
                        </form.Field>

                        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                            {([canSubmit, formIsSubmitting]) => (
                                <Button type="submit" className="w-full" disabled={!canSubmit || formIsSubmitting}>
                                    {formIsSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                                    Create Organization
                                </Button>
                            )}
                        </form.Subscribe>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
