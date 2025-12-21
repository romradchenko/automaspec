'use client'

import { ArrowLeft, RefreshCw, ServerCrash } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { ERROR_PAGE_CONTENT } from '@/lib/constants'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    const content = ERROR_PAGE_CONTENT.serverError

    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
            <div className="w-full max-w-xl space-y-6 text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ServerCrash className="size-8" />
                </div>
                <div className="space-y-2">
                    <p className="text-muted-foreground text-sm font-semibold tracking-[0.3em]">{content.code}</p>
                    <h1 className="font-bold text-3xl">{content.title}</h1>
                    <p className="text-muted-foreground">{content.description}</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button className="w-full sm:w-auto" onClick={() => reset()}>
                        <RefreshCw className="mr-2 size-4" />
                        {content.primaryActionLabel}
                    </Button>
                    <Link className="w-full sm:w-auto" href={content.secondaryActionHref}>
                        <Button className="w-full sm:w-auto" variant="outline">
                            <ArrowLeft className="mr-2 size-4" />
                            {content.secondaryActionLabel}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
