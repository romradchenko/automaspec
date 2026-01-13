import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { IGNORED_TEST_FOLDERS } from '@/lib/constants'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function normalizeTestFileName(filePath: string): string {
    const parts = filePath.split('/').filter(Boolean)
    if (parts.length === 0) return ''
    const fileName = parts[parts.length - 1]
    const withoutExtension = fileName.replace(/\.(test|spec)\.(ts|tsx|js|jsx)$/, '')
    const words = withoutExtension.split(/[-_.]/).filter(Boolean)
    const capitalized = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    return capitalized.join(' ')
}

export function extractFolderPath(filePath: string): string[] {
    const parts = filePath.split('/').filter(Boolean)
    parts.pop()

    let startIndex = 0
    for (let i = 0; i < parts.length; i++) {
        if (IGNORED_TEST_FOLDERS.has(parts[i])) {
            startIndex = i
            break
        }
    }

    const filtered: string[] = []
    for (let i = startIndex; i < parts.length; i++) {
        const part = parts[i]
        if (IGNORED_TEST_FOLDERS.has(part)) continue
        filtered.push(part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    }
    return filtered
}

export function extractRelativeFilePath(filePath: string): string {
    const parts = filePath.split('/').filter(Boolean)
    if (parts.length === 0) return ''
    return parts[parts.length - 1]
}
