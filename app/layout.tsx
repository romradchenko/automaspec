import type { Metadata } from 'next'

import './globals.css'
import '../lib/orpc/orpc.server' // for pre-rendering
import { Providers } from './providers'

export const metadata: Metadata = {
    title: 'Automaspec',
    description: 'Automaspec - Your AI-powered solution for automating your business processes'
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head></head>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
