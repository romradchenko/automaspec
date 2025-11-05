'use client'

import { authClient } from '@/lib/shared/better-auth'
import { useForm } from '@tanstack/react-form'

import { toast } from 'sonner'
import * as z from 'zod'
import { Eye, EyeOff, Chrome, Github } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { FieldInfo } from '@/lib/shared/tanstack-form'

const SignUpSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters')
})

const SocialAuthButtons = () => (
    <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" type="button">
            <Github className="mr-2 h-4 w-4" />
            GitHub
        </Button>
        <Button variant="outline" type="button">
            <Chrome className="mr-2 h-4 w-4" />
            Google
        </Button>
    </div>
)

const AuthSeparator = () => (
    <div className="relative">
        <div className="absolute inset-0 flex items-center">
            <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
    </div>
)

interface AuthFormProps {
    onToggle: () => void
}

export default function SignUpForm({ onToggle }: AuthFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const { data: organizations } = authClient.useListOrganizations()

    const form = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        },
        validators: {
            onChange: SignUpSchema
        },
        onSubmit: async ({ value }) => {
            await authClient.signUp.email(
                {
                    email: value.email,
                    password: value.password,
                    name: value.name,
                    callbackURL: organizations && organizations.length > 0 ? '/dashboard' : '/create-organization'
                },
                {
                    onSuccess: async () => {
                        toast.success('Sign up successful')
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
                <CardTitle className="text-center text-2xl">Sign up</CardTitle>
                <CardDescription className="text-center">Enter your information to create your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <SocialAuthButtons />
                <AuthSeparator />

                <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }}
                >
                    <div>
                        <form.Field name="name">
                            {(field) => (
                                <div className="space-y-2">
                                    <Label htmlFor={field.name}>Name</Label>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        placeholder="Enter your full name"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    <FieldInfo field={field} />
                                </div>
                            )}
                        </form.Field>
                    </div>

                    <div>
                        <form.Field name="email">
                            {(field) => (
                                <div className="space-y-2">
                                    <Label htmlFor={field.name}>Email</Label>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type="email"
                                        placeholder="name@example.com"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    <FieldInfo field={field} />
                                </div>
                            )}
                        </form.Field>
                    </div>

                    <div>
                        <form.Field name="password">
                            {(field) => (
                                <div className="space-y-2">
                                    <Label htmlFor={field.name}>Password</Label>
                                    <div className="relative">
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter your password"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                        />
                                        <Button
                                            className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                            size="sm"
                                            type="button"
                                            variant="ghost"
                                        >
                                            {showPassword ?
                                                <EyeOff className="h-4 w-4" />
                                            :   <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                    <FieldInfo field={field} />
                                </div>
                            )}
                        </form.Field>
                    </div>

                    <form.Subscribe>
                        {(state) => (
                            <Button type="submit" className="w-full" disabled={!state.canSubmit || state.isSubmitting}>
                                {state.isSubmitting ? 'Creating account...' : 'Create account'}
                            </Button>
                        )}
                    </form.Subscribe>
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
