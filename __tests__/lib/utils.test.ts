import { describe, expect, it } from 'vitest'

import { cn, normalizeTestFileName, extractFolderPath } from '@/lib/utils'

describe('utils', () => {
    describe('cn (className merger)', () => {
        it('should merge class names', () => {
            const result = cn('class1', 'class2')
            expect(result).toContain('class1')
            expect(result).toContain('class2')
        })

        it('should handle conditional classes', () => {
            // oxlint-disable-next-line no-constant-binary-expression
            const result = cn('base', false && 'hidden', true && 'visible')
            expect(result).toContain('base')
            expect(result).toContain('visible')
            expect(result).not.toContain('hidden')
        })

        it('should handle tailwind merge', () => {
            const result = cn('px-2 py-1', 'px-3')
            expect(result).toContain('px-3')
            expect(result).not.toContain('px-2')
        })

        it('should handle undefined and null', () => {
            // oxlint-disable-next-line no-null
            const result = cn('class1', undefined, null, 'class2')
            expect(result).toContain('class1')
            expect(result).toContain('class2')
        })
    })

    describe('normalizeTestFileName', () => {
        it('should convert kebab-case file names', () => {
            const result = normalizeTestFileName('__tests__/user-service.test.ts')
            expect(result).toBe('User Service')
        })

        it('should convert snake_case file names', () => {
            const result = normalizeTestFileName('lib/api_client.test.tsx')
            expect(result).toBe('Api Client')
        })

        it('should handle dot-separated file names', () => {
            const result = normalizeTestFileName('components/button.primary.test.js')
            expect(result).toBe('Button Primary')
        })

        it('should handle mixed separators', () => {
            const result = normalizeTestFileName('__tests__/user-auth_login.test.tsx')
            expect(result).toBe('User Auth Login')
        })

        it('should handle spec files', () => {
            const result = normalizeTestFileName('e2e/dashboard.spec.ts')
            expect(result).toBe('Dashboard')
        })

        it('should handle simple file names', () => {
            const result = normalizeTestFileName('utils.test.ts')
            expect(result).toBe('Utils')
        })
    })

    describe('extractFolderPath', () => {
        it('should extract folder names from path', () => {
            const result = extractFolderPath('__tests__/lib/utils/helpers.test.ts')
            expect(result).toEqual(['Lib', 'Utils'])
        })

        it('should ignore empty path segments', () => {
            const result = extractFolderPath('__tests__//lib//utils/helpers.test.ts')
            expect(result).toEqual(['Lib', 'Utils'])
        })

        it('should skip __tests__ folder', () => {
            const result = extractFolderPath('__tests__/components/button.test.tsx')
            expect(result).toEqual(['Components'])
        })

        it('should skip tests folder', () => {
            const result = extractFolderPath('tests/unit/service.test.ts')
            expect(result).toEqual(['Unit'])
        })

        it('should skip test folder', () => {
            const result = extractFolderPath('test/integration/api.test.ts')
            expect(result).toEqual(['Integration'])
        })

        it('should skip e2e folder', () => {
            const result = extractFolderPath('e2e/auth/login.spec.ts')
            expect(result).toEqual(['Auth'])
        })

        it('should return empty array for root level files', () => {
            const result = extractFolderPath('__tests__/main.test.ts')
            expect(result).toEqual([])
        })

        it('should handle deeply nested paths', () => {
            const result = extractFolderPath('__tests__/orpc/routes/organization/members.test.ts')
            expect(result).toEqual(['Orpc', 'Routes', 'Organization'])
        })
    })
})
