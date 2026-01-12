'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card'
import { authClient } from '@/lib/shared/better-auth-client'
import { useAppForm } from '@/lib/shared/tanstack-form'

import { SignInSchema } from './shared'

interface SignInFormProps {
    onToggle: () => void
    initialEmail?: string
    initialPassword?: string
    onValuesChange: (values: { email?: string; password?: string }) => void
}

export function SignInForm({ onToggle, initialEmail = '', initialPassword = '', onValuesChange }: SignInFormProps) {
    const router = useRouter()
    const isRedirectingRef = useRef(false)
    const { data: session } = authClient.useSession()

    useEffect(() => {
        if (session && isRedirectingRef.current) {
            router.replace('/choose-organization')
        }
    }, [session, router])

    const formApi = useAppForm({
        defaultValues: {
            email: initialEmail,
            password: initialPassword
        },
        validators: {
            onChange: SignInSchema
        },
        onSubmit: async ({ value }) => {
            await authClient.signIn.email(
                {
                    email: value.email,
                    password: value.password
                },
                {
                    onSuccess: async () => {
                        isRedirectingRef.current = true
                        toast.success('Sign in successful')
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.message)
                    }
                }
            )
        }
    })

    return (
        <Card>
            <CardHeader className="space-y-1">
                <CardTitle className="text-center text-2xl">Sign in</CardTitle>
                <CardDescription className="text-center">
                    Enter your email and password to access your dashboard
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        void formApi.handleSubmit()
                    }}
                    className="space-y-4"
                >
                    <formApi.AppForm>
                        <formApi.SyncEmailAndPasswordValues onValuesChange={onValuesChange} />
                        <formApi.AppField name="email">
                            {(field) => <field.EmailField label="Email" />}
                        </formApi.AppField>
                        <formApi.AppField name="password">
                            {(field) => <field.PasswordField label="Password" />}
                        </formApi.AppField>
                        <formApi.SubmitButton />
                    </formApi.AppForm>
                </form>

                <div className="text-center text-sm">
                    Don't have an account?{' '}
                    <Button
                        variant="link"
                        className="p-0 h-auto text-primary hover:underline"
                        onClick={onToggle}
                        type="button"
                    >
                        Sign up
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
