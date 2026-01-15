'use client'

import { FolderTree, ListChecks, Loader2, Sparkles, BarChart3, Users, RefreshCw, Wand2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'

interface SampleProjectModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    isLoading: boolean
}

export function SampleProjectModal({ open, onOpenChange, onConfirm, isLoading }: SampleProjectModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="size-5 text-primary" />
                        Welcome to Automaspec
                    </DialogTitle>
                    <DialogDescription>
                        Automaspec transforms how teams manage test specifications. Import your Vitest results and let
                        us handle the rest.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        What Automaspec does for you
                    </p>
                    <div className="space-y-2.5">
                        <div className="flex items-start gap-3 rounded-lg border p-3">
                            <FolderTree className="mt-0.5 size-4 shrink-0 text-blue-500" />
                            <div>
                                <p className="text-sm font-medium">Automatic Test Organization</p>
                                <p className="text-xs text-muted-foreground">
                                    Your tests are automatically organized into folders and specs based on file
                                    structure
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 rounded-lg border p-3">
                            <ListChecks className="mt-0.5 size-4 shrink-0 text-orange-500" />
                            <div>
                                <p className="text-sm font-medium">Requirements & Traceability</p>
                                <p className="text-xs text-muted-foreground">
                                    Link tests to business requirements and track what's covered and what's missing
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 rounded-lg border p-3">
                            <RefreshCw className="mt-0.5 size-4 shrink-0 text-cyan-500" />
                            <div>
                                <p className="text-sm font-medium">Sync with CI/CD</p>
                                <p className="text-xs text-muted-foreground">
                                    Re-import test results anytime to keep your dashboard up to date with latest runs
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 rounded-lg border p-3">
                            <BarChart3 className="mt-0.5 size-4 shrink-0 text-green-500" />
                            <div>
                                <p className="text-sm font-medium">Analytics & Trends</p>
                                <p className="text-xs text-muted-foreground">
                                    Track pass rates, flaky tests, and coverage trends over time
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 rounded-lg border p-3">
                            <Users className="mt-0.5 size-4 shrink-0 text-purple-500" />
                            <div>
                                <p className="text-sm font-medium">Team Collaboration</p>
                                <p className="text-xs text-muted-foreground">
                                    Invite your team to review specs, assign ownership, and discuss requirements
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 rounded-lg border p-3">
                            <Wand2 className="mt-0.5 size-4 shrink-0 text-pink-500" />
                            <div>
                                <p className="text-sm font-medium">AI-Powered Suggestions</p>
                                <p className="text-xs text-muted-foreground">
                                    Get intelligent recommendations for missing test cases and requirement gaps
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            'Explore with Sample Data'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
