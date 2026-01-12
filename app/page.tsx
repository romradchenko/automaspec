'use client'

import { ArrowRight, CheckCircle, Chrome, Code, Github, Shield, Users, Zap } from 'lucide-react'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authClient } from '@/lib/shared/better-auth-client'

export default function LandingPage() {
    const { data: session, isPending: isPendingSession } = authClient.useSession()
    const { data: activeOrganization, isPending: isPendingActiveOrg } = authClient.useActiveOrganization()
    const { data: organizations, isPending: isPendingOrganizations } = authClient.useListOrganizations()

    const isLoading = isPendingSession || isPendingActiveOrg || isPendingOrganizations

    const getAppLink = () => {
        if (!session || isLoading) return '/dashboard'
        if (!activeOrganization) {
            if (organizations && organizations.length > 0) return '/choose-organization'
            return '/create-organization'
        }
        return '/dashboard'
    }

    const getAppButtonText = () => {
        if (!session || isLoading) return 'Go to App'
        if (!activeOrganization) {
            if (organizations && organizations.length > 0) return 'Choose Organization'
            return 'Create Organization'
        }
        return 'Go to App'
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b">
                <div className="container mx-auto flex items-center justify-between px-4 py-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <Code className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-xl">AutomaSpec</span>
                    </div>
                    <nav className="hidden items-center gap-6 md:flex">
                        <Link className="text-muted-foreground hover:text-foreground" href="#features">
                            Features
                        </Link>
                        <Link className="text-muted-foreground hover:text-foreground" href="#pricing">
                            Pricing
                        </Link>
                        {session ? (
                            <div className="flex items-center gap-4">
                                <Link href={getAppLink()}>
                                    <Button>{getAppButtonText()}</Button>
                                </Link>
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={session.user.image || undefined} alt={session.user.name} />
                                    <AvatarFallback>
                                        {session.user.name?.slice(0, 2).toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        ) : (
                            <>
                                <Link className="text-muted-foreground hover:text-foreground" href="/login">
                                    Login
                                </Link>
                                <Link href="/dashboard">
                                    <Button>Get Started</Button>
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <section className="px-4 py-20">
                <div className="container mx-auto max-w-4xl text-center">
                    <Badge className="mb-4" variant="secondary">
                        🚀 Supporting Vitest
                    </Badge>
                    <h1 className="mb-6 bg-linear-to-r from-primary to-blue-600 bg-clip-text font-bold text-5xl text-transparent leading-tight">
                        Testing Made Simple
                    </h1>
                    <p className="mx-auto mb-8 max-w-2xl text-muted-foreground text-xl">
                        Transform your test specifications into executable code. Manage, run, and track your tests with
                        a modern dashboard built for developers, testers, and managers.
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Link href={getAppLink()}>
                            <Button className="px-8 text-lg" size="lg">
                                {session ? getAppButtonText() : 'Start Testing Free'}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="bg-muted/30 px-4 py-20" id="features">
                <div className="container mx-auto">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 font-bold text-3xl">Everything you need for testing</h2>
                        <p className="mx-auto max-w-2xl text-muted-foreground">
                            From test specification to execution, manage your entire testing workflow in one place.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <Code className="mb-2 h-10 w-10 text-primary" />
                                <CardTitle>Code Generation</CardTitle>
                                <CardDescription>
                                    Generate code from your test specifications with one click.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Zap className="mb-2 h-10 w-10 text-primary" />
                                <CardTitle>Real-time Execution</CardTitle>
                                <CardDescription>
                                    Run tests directly from the dashboard and see results in real-time with detailed
                                    logs.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Shield className="mb-2 h-10 w-10 text-primary" />
                                <CardTitle>Role-based Access</CardTitle>
                                <CardDescription>
                                    Different permissions for developers, testers, and managers. Control who can edit
                                    what.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Users className="mb-2 h-10 w-10 text-primary" />
                                <CardTitle>Team Collaboration</CardTitle>
                                <CardDescription>
                                    Share test suites, track coverage, and collaborate with your team in real-time.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Github className="mb-2 h-10 w-10 text-primary" />
                                <CardTitle>Git Integration</CardTitle>
                                <CardDescription>
                                    Sync with your repositories, track changes, and integrate with your CI/CD pipeline.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Chrome className="mb-2 h-10 w-10 text-primary" />
                                <CardTitle>Cross-browser Testing</CardTitle>
                                <CardDescription>
                                    Test across different browsers and devices with built-in Vitest integration.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="px-4 py-20" id="pricing">
                <div className="container mx-auto">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 font-bold text-3xl">Simple, transparent pricing</h2>
                        <p className="text-muted-foreground">Start free, upgrade when you need more power.</p>
                    </div>

                    <div className="flex justify-center">
                        <Card className="w-full max-w-sm">
                            <CardHeader>
                                <CardTitle className="text-2xl">Free</CardTitle>
                                <CardDescription>Perfect for getting started</CardDescription>
                                <div className="mt-4 font-bold text-3xl">$0</div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-sm">Up to 50 tests</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-sm">Basic code generation</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-sm">Community support</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-sm">1 project</span>
                                    </div>
                                </div>
                                <Link className="block" href={getAppLink()}>
                                    <Button className="w-full">{session ? 'Go to App' : 'Get Started Free'}</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="bg-primary px-4 py-20 text-primary-foreground">
                <div className="container mx-auto text-center">
                    <h2 className="mb-4 font-bold text-3xl">Ready to streamline your testing?</h2>
                    <p className="mb-8 text-xl opacity-90">
                        Join thousands of developers who trust AutomaSpec for their testing needs.
                    </p>
                    <Link href={getAppLink()}>
                        <Button className="px-8 text-lg" size="lg" variant="secondary">
                            {session ? getAppButtonText() : 'Start Your Free Trial'}
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>

            <footer className="border-t px-4 py-12">
                <div className="container mx-auto">
                    <div className="text-center">
                        <div className="mb-4 flex items-center justify-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
                                <Code className="h-4 w-4 text-primary-foreground" />
                            </div>
                            <span className="font-bold">AutomaSpec</span>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Modern testing dashboard for developers, testers, and managers.
                        </p>
                    </div>
                    <div className="mt-8 border-t pt-8 text-center text-muted-foreground text-sm">
                        © {new Date().getFullYear()} AutomaSpec. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    )
}
