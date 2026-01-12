'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card'
import { authClient } from '@/lib/shared/better-auth-client'
import { useAppForm } from '@/lib/shared/tanstack-form'

import { SignUpSchema } from './shared'

interface SignUpFormProps {
    onToggle: () => void
    initialEmail?: string
    initialPassword?: string
    onValuesChange: (values: { email?: string; password?: string }) => void
}

export function SignUpForm({ onToggle, initialEmail = '', initialPassword = '', onValuesChange }: SignUpFormProps) {
    const router = useRouter()
    const isRedirectingRef = useRef(false)
    const { data: session } = authClient.useSession()

    useEffect(() => {
        if (session && isRedirectingRef.current) {
            router.replace('/create-organization')
        }
    }, [session, router])

    const formApi = useAppForm({
        defaultValues: {
            name: '',
            email: initialEmail,
            password: initialPassword
        },
        validators: {
            onChange: SignUpSchema
        },
        onSubmit: async ({ value }) => {
            isRedirectingRef.current = true
            void authClient.signUp.email(
                {
                    email: value.email,
                    password: value.password,
                    name: value.name
                },
                {
                    onSuccess: async () => {
                        toast.success('Sign up successful')
                    },
                    onError: (ctx) => {
                        isRedirectingRef.current = false
                        toast.error(ctx.error.message)
                    }
                }
            )
        }
    })

    return (
        <Card>
            <CardHeader className="space-y-1">
                <CardTitle className="text-center text-2xl">Sign up</CardTitle>
                <CardDescription className="text-center">Enter your information to create your account</CardDescription>
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
                        <formApi.AppField name="name">{(field) => <field.NameField label="Name" />}</formApi.AppField>
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
                    Already have an account?{' '}
                    <Button
                        variant="link"
                        className="p-0 h-auto text-primary hover:underline"
                        onClick={onToggle}
                        type="button"
                    >
                        Sign in
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
