'use client'

import { ArrowLeft, RefreshCw, ServerCrash } from 'lucide-react'
import Link from 'next/link'

import { ERROR_PAGE_CONTENT } from '@/lib/constants'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    const getErrorContent = () => {
        if (error.message === 'Invalid URL') {
            return ERROR_PAGE_CONTENT.notFound
        }
        return ERROR_PAGE_CONTENT.serverError
    }

    const content = getErrorContent()

    return (
        <html lang="en">
            <body>
                <div
                    style={{
                        display: 'flex',
                        minHeight: '100vh',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'oklch(0.99 0.01 264)',
                        padding: '24px',
                        fontFamily: 'Arial, Helvetica, sans-serif',
                        backgroundImage:
                            'radial-gradient(at 0% 0%, oklch(0.5 0.28 264 / 0.03) 0px, transparent 50%), radial-gradient(at 100% 100%, oklch(0.55 0.3 280 / 0.03) 0px, transparent 50%)'
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            maxWidth: '512px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '24px',
                            textAlign: 'center'
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                width: '64px',
                                height: '64px',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%',
                                backgroundColor: 'oklch(0.5 0.28 264 / 0.1)',
                                color: 'oklch(0.5 0.28 264)',
                                margin: '0 auto'
                            }}
                        >
                            <ServerCrash size={32} />
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                            }}
                        >
                            <p
                                style={{
                                    color: 'oklch(0.45 0.05 264)',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    letterSpacing: '0.3em',
                                    margin: '0'
                                }}
                            >
                                {content.code}
                            </p>
                            <h1
                                style={{
                                    fontSize: '30px',
                                    fontWeight: '700',
                                    margin: '0',
                                    color: 'oklch(0.15 0.03 264)'
                                }}
                            >
                                {content.title}
                            </h1>
                            <p
                                style={{
                                    color: 'oklch(0.45 0.05 264)',
                                    margin: '0'
                                }}
                            >
                                {content.description}
                            </p>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => reset()}
                                style={{
                                    width: '100%',
                                    padding: '12px 24px',
                                    backgroundColor: 'oklch(0.5 0.28 264)',
                                    color: 'oklch(0.98 0.005 264)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                <RefreshCw size={16} />
                                {content.primaryActionLabel}
                            </button>
                            <Link
                                href={content.secondaryActionHref}
                                style={{
                                    width: '100%',
                                    textDecoration: 'none'
                                }}
                            >
                                <button
                                    type="button"
                                    style={{
                                        width: '100%',
                                        padding: '12px 24px',
                                        backgroundColor: 'transparent',
                                        color: 'oklch(0.15 0.03 264)',
                                        border: '1px solid oklch(0.88 0.02 264)',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <ArrowLeft size={16} />
                                    {content.secondaryActionLabel}
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    )
}
