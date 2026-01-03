'use client'

import { ArrowLeft, RefreshCw, ServerCrash } from 'lucide-react'
import Link from 'next/link'

import type { GlobalErrorProps } from '@/lib/types'

import { ERROR_PAGE_CONTENT } from '@/lib/constants'

import styles from './global-error.module.css'

export default function GlobalError({ error, reset }: GlobalErrorProps) {
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
                <div className={styles.page}>
                    <div className={styles.card}>
                        <div className={styles.iconWrapper}>
                            <ServerCrash size={32} />
                        </div>
                        <div className={styles.textGroup}>
                            <p className={styles.code}>{content.code}</p>
                            <h1 className={styles.title}>{content.title}</h1>
                            <p className={styles.description}>{content.description}</p>
                        </div>
                        <div className={styles.actions}>
                            <button type="button" onClick={() => reset()} className={styles.primaryButton}>
                                <RefreshCw size={16} />
                                {content.primaryActionLabel}
                            </button>
                            <Link href={content.secondaryActionHref} className={styles.secondaryButton}>
                                <ArrowLeft size={16} />
                                {content.secondaryActionLabel}
                            </Link>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    )
}
