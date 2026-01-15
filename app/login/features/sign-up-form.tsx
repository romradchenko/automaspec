'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
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
    const [isLoading, setIsLoading] = useState(false)

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
            setIsLoading(true)

            const { error } = await authClient.signUp.email({
                email: value.email,
                password: value.password,
                name: value.name
            })

            if (error) {
                setIsLoading(false)
                toast.error(error.message)
                return
            }

            toast.success('Sign up successful')
            router.replace('/create-organization')
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
                        <formApi.Subscribe>
                            {(state) => (
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={!state.canSubmit || state.isSubmitting || isLoading}
                                >
                                    {state.isSubmitting || isLoading ? 'Creating account...' : 'Create account'}
                                </Button>
                            )}
                        </formApi.Subscribe>
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
