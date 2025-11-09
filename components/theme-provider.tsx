'use client'

import type { ComponentProps } from 'react'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

import { SpacemanThemeProvider } from '@space-man/react-theme-animation'

export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
    return (
        <NextThemesProvider {...props} attribute="class">
            <SpacemanThemeProvider
                themes={['light', 'dark', 'system']}
                defaultTheme="system"
                defaultColorTheme="default"
            >
                {children}
            </SpacemanThemeProvider>
        </NextThemesProvider>
    )
}
