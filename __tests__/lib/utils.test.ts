import { describe, it, expect } from 'vitest'

import { cn } from '@/lib/utils'

describe('Utils', () => {
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
            // Should keep only px-3 due to tailwind-merge
            expect(result).toContain('px-3')
            expect(result).not.toContain('px-2')
        })

        it('should handle undefined and null', () => {
            const result = cn('class1', undefined, null, 'class2')
            expect(result).toContain('class1')
            expect(result).toContain('class2')
        })
    })
})
