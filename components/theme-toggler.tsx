'use client'

import { useThemeAnimation } from '@space-man/react-theme-animation'
import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function ModeToggle() {
    const { toggleTheme, ref } = useThemeAnimation()

    return (
        <Button ref={ref} variant="outline" size="icon" onClick={toggleTheme}>
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
