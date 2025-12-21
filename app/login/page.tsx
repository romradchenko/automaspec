'use client'

import { useForm, type AnyFieldApi } from '@tanstack/react-form'
import { Code, Eye, EyeOff, Chrome, Github } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type ReactNode, useState } from 'react'
import { toast } from 'sonner'
import * as z from 'zod'

import Loader from '@/components/loader'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { authClient } from '@/lib/shared/better-auth-client'
import { FieldInfo } from '@/lib/shared/tanstack-form'

const SignInSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    remember: z.boolean()
})

const SignUpSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters')
})

type FormWithField = {
    Field: (props: { name: string; children: (field: AnyFieldApi) => ReactNode }) => ReactNode | Promise<ReactNode>
}

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

function EmailField({ form, fieldName = 'email' }: { form: FormWithField; fieldName?: string }) {
    return (
        <div>
            <form.Field name={fieldName}>
                {(field: AnyFieldApi) => (
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
    )
}

function NameField({ form, fieldName = 'name' }: { form: FormWithField; fieldName?: string }) {
    return (
        <div>
            <form.Field name={fieldName}>
                {(field: AnyFieldApi) => (
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
    )
}

function PasswordField({
    form,
    fieldName = 'password',
    showPassword,
    setShowPassword
}: {
    form: FormWithField
    fieldName?: string
    showPassword: boolean
    setShowPassword: (v: boolean) => void
}) {
    return (
        <div>
            <form.Field name={fieldName}>
                {(field: AnyFieldApi) => (
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
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                        <FieldInfo field={field} />
                    </div>
                )}
            </form.Field>
        </div>
    )
}

interface AuthFormProps {
    onToggle: () => void
}

function SignInForm({ onToggle }: AuthFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()

    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
            remember: true
        },
        validators: {
            onSubmit: SignInSchema
        },
        onSubmit: async ({ value }) => {
            await authClient.signIn.email(
                {
                    email: value.email,
                    password: value.password,
                    rememberMe: value.remember
                },
                {
                    onSuccess: async () => {
                        toast.success('Sign in successful')
                        const { data: organizations } = await authClient.organization.list()
                        router.push(
                            organizations && organizations.length > 0 ? '/choose-organization' : '/create-organization'
                        )
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
                    <EmailField form={form} fieldName="email" />

                    <PasswordField
                        form={form}
                        fieldName="password"
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                    />

                    <div className="flex items-center justify-between">
                        <form.Field name="remember">
                            {(field) => (
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id={field.name}
                                        checked={field.state.value}
                                        onCheckedChange={(checked) => field.handleChange(!!checked)}
                                    />
                                    <Label className="text-primary text-sm" htmlFor={field.name}>
                                        Remember me
                                    </Label>
                                </div>
                            )}
                        </form.Field>
                        <Link className="text-primary text-sm hover:underline" href="#">
                            Forgot password?
                        </Link>
                    </div>

                    <form.Subscribe>
                        {(state) => (
                            <Button type="submit" className="w-full" disabled={!state.canSubmit || state.isSubmitting}>
                                {state.isSubmitting ? 'Signing in...' : 'Sign in'}
                            </Button>
                        )}
                    </form.Subscribe>
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

function SignUpForm({ onToggle }: AuthFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()

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
                    name: value.name
                    // NOTE: callbackURL does not work here because it is for email verification
                },
                {
                    onSuccess: async () => {
                        toast.success('Sign up successful')
                        const { data: organizations } = await authClient.organization.list()
                        router.push(
                            organizations && organizations.length > 0 ? '/choose-organization' : '/create-organization'
                        )
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
                    <NameField form={form} fieldName="name" />

                    <EmailField form={form} fieldName="email" />

                    <PasswordField
                        form={form}
                        fieldName="password"
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                    />

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

export default function LoginPage() {
    const { data: session, isPending } = authClient.useSession()
    const [isSignUp, setIsSignUp] = useState(false)

    if (isPending) return <Loader />

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8 items-center justify-center">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <Link className="mb-4 inline-flex items-center gap-2" href="/">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-colored">
                                <Code className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <span className="font-bold text-xl bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                                AutomaSpec
                            </span>
                        </Link>
                        <h1 className="font-bold text-2xl">{isSignUp ? 'Create your account' : 'Welcome back'}</h1>
                        <p className="text-muted-foreground">
                            {isSignUp
                                ? 'Sign up to get started with AutomaSpec'
                                : 'Sign in to your account to continue'}
                        </p>
                    </div>

                    {isSignUp ? (
                        <SignUpForm onToggle={() => setIsSignUp(false)} />
                    ) : (
                        <SignInForm onToggle={() => setIsSignUp(true)} />
                    )}
                </div>

                <div className="w-full max-w-xs shrink-0 flex flex-col gap-4">
                    {session && (
                        <Alert className="mb-0">
                            <AlertDescription>
                                You are already signed in as <strong>{session.user.email}</strong>
                                <div className="flex items-center gap-2 mt-2">
                                    <Link href="/dashboard" className="text-primary hover:underline">
                                        Go to dashboard
                                    </Link>
                                    <span className="text-muted-foreground">or</span>
                                    <Button
                                        variant="link"
                                        className="p-0 h-auto text-primary hover:underline"
                                        onClick={() => authClient.signOut()}
                                    >
                                        sign out
                                    </Button>
                                </div>
                            </AlertDescription>
                        </Alert>
                    )}
                    <Card className="bg-muted/50">
                        <CardContent className="pt-4">
                            <p className="mb-2 text-center text-muted-foreground text-sm">Demo credentials:</p>
                            <div className="space-y-1 text-center text-xs">
                                <p>Email: demo@automaspec.com</p>
                                <p>Password: demo1234</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
