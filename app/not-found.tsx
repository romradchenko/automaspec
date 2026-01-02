import { ArrowLeft, SearchX } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { ERROR_PAGE_CONTENT } from '@/lib/constants'

export default function NotFoundPage() {
    const content = ERROR_PAGE_CONTENT.notFound

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
            <div className="w-full max-w-xl space-y-6 text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <SearchX className="size-8" />
                </div>
                <div className="space-y-2">
                    <p className="text-muted-foreground text-sm font-semibold tracking-[0.3em]">{content.code}</p>
                    <h1 className="font-bold text-3xl">{content.title}</h1>
                    <p className="text-muted-foreground">{content.description}</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Link className="w-full sm:w-auto" href={content.primaryActionHref}>
                        <Button className="w-full sm:w-auto">{content.primaryActionLabel}</Button>
                    </Link>
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
