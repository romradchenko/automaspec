'use client'

import { useState } from 'react'

import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { createQueryClient } from '@/lib/query/client'
import { QueryClientProvider } from '@tanstack/react-query'

export function Providers(props: { children: React.ReactNode }) {
    const [queryClient] = useState(() => createQueryClient())

    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <QueryClientProvider client={queryClient}>
                <Toaster />
                {props.children}
            </QueryClientProvider>
        </ThemeProvider>
    )
}
