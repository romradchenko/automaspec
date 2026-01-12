'use client'

import { Upload, FileText, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface OnboardingEmptyStateProps {
    onImportClick: () => void
}

export function OnboardingEmptyState({ onImportClick }: OnboardingEmptyStateProps) {
    return (
        <div className="flex h-full flex-col items-center justify-center p-8">
            <div className="mx-auto max-w-2xl text-center">
                <div className="mb-6 flex justify-center">
                    <div className="rounded-full bg-primary/10 p-4">
                        <Sparkles className="size-12 text-primary" />
                    </div>
                </div>

                <h1 className="mb-3 text-3xl font-bold tracking-tight">Welcome to Automaspec!</h1>
                <p className="mb-8 text-lg text-muted-foreground">
                    Get started by importing your existing Vitest tests or create your test specifications from scratch.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Card className="cursor-pointer border-2 transition-all hover:border-primary hover:shadow-md">
                        <CardHeader
                            className="pb-3"
                            role="button"
                            tabIndex={0}
                            onClick={onImportClick}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault()
                                    onImportClick()
                                }
                            }}
                        >
                            <div className="mx-auto mb-2 rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                                <Upload className="size-6 text-green-600 dark:text-green-400" />
                            </div>
                            <CardTitle className="text-lg">Import from Vitest</CardTitle>
                            <CardDescription>
                                Upload a JSON report from your existing Vitest tests to get started quickly
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-0">
                            <div className="rounded-lg border bg-muted/50 p-3">
                                <p className="text-xs font-medium">Generate the JSON report:</p>
                                <code className="mt-1 block rounded bg-background p-2 text-xs">
                                    pnpm vitest --reporter=json --outputFile=test-results.json
                                </code>
                            </div>
                            <Button
                                className="w-full"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onImportClick()
                                }}
                            >
                                Import Tests
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-2 opacity-60">
                        <CardHeader className="pb-3">
                            <div className="mx-auto mb-2 rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                                <FileText className="size-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <CardTitle className="text-lg">Start from Scratch</CardTitle>
                            <CardDescription>
                                Create your test specifications manually with our intuitive editor
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <Button variant="outline" className="w-full" disabled>
                                Coming Soon
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
