'use client'

import { Code } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useState } from 'react'

import Loader from '@/components/loader'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { authClient } from '@/lib/shared/better-auth-client'

import { SignInForm } from './features/sign-in-form'
import { SignUpForm } from './features/sign-up-form'

export default function LoginPage() {
    const { data: session, isPending } = authClient.useSession()
    const [isSignUp, setIsSignUp] = useState(false)
    const [authValues, setAuthValues] = useState({ email: '', password: '' })
    const [resetKey, setResetKey] = useState(0)

    const handleValuesChange = useCallback((values: { email?: string; password?: string }) => {
        setAuthValues((prev) => ({
            ...prev,
            ...values
        }))
    }, [])

    const handleToggle = useCallback(() => {
        setIsSignUp((prev) => !prev)
        setResetKey((prev) => prev + 1)
    }, [])

    const handleUseCredentials = useCallback(() => {
        setIsSignUp(false)
        setAuthValues({ email: 'demo@automaspec.com', password: 'demo1234' })
        setResetKey((prev) => prev + 1)
    }, [])

    if (isPending) return <Loader />

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8 items-center justify-center">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <Link className="mb-4 inline-flex items-center gap-2" href="/">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-primary shadow-colored">
                                <Code className="size-5 text-primary-foreground" />
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
                        <SignUpForm
                            key={`signup-${resetKey}`}
                            onToggle={handleToggle}
                            initialEmail={authValues.email}
                            initialPassword={authValues.password}
                            onValuesChange={handleValuesChange}
                        />
                    ) : (
                        <SignInForm
                            key={`signin-${resetKey}`}
                            onToggle={handleToggle}
                            initialEmail={authValues.email}
                            initialPassword={authValues.password}
                            onValuesChange={handleValuesChange}
                        />
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
                                        onClick={async () => authClient.signOut()}
                                    >
                                        sign out
                                    </Button>
                                </div>
                            </AlertDescription>
                        </Alert>
                    )}
                    <Card className="bg-muted/50">
                        <CardContent className="pt-4 pb-4">
                            <p className="mb-2 text-center text-muted-foreground text-sm">Demo credentials:</p>
                            <div className="space-y-1 text-center text-xs mb-4">
                                <p>Email: demo@automaspec.com</p>
                                <p>Password: demo1234</p>
                            </div>
                            <Button className="w-full" onClick={handleUseCredentials} variant="outline">
                                Use credentials
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
