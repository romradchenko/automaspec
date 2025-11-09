import { describe, it, expect } from 'vitest'

import { TEST_STATUSES, SPEC_STATUSES, STATUS_CONFIGS } from '@/lib/constants'

describe('Constants', () => {
    describe('TEST_STATUSES', () => {
        it('should contain all required test statuses', () => {
            expect(TEST_STATUSES).toHaveProperty('passed')
            expect(TEST_STATUSES).toHaveProperty('failed')
            expect(TEST_STATUSES).toHaveProperty('pending')
            expect(TEST_STATUSES).toHaveProperty('skipped')
            expect(TEST_STATUSES).toHaveProperty('todo')
            expect(TEST_STATUSES).toHaveProperty('disabled')
            expect(TEST_STATUSES).toHaveProperty('missing')
        })

        it('should have string values matching keys', () => {
            expect(TEST_STATUSES.passed).toBe('passed')
            expect(TEST_STATUSES.failed).toBe('failed')
            expect(TEST_STATUSES.pending).toBe('pending')
        })
    })

    describe('SPEC_STATUSES', () => {
        it('should extend TEST_STATUSES with additional statuses', () => {
            expect(SPEC_STATUSES).toHaveProperty('deactivated')
            expect(SPEC_STATUSES).toHaveProperty('partial')
        })

        it('should include all test statuses', () => {
            Object.keys(TEST_STATUSES).forEach((key) => {
                expect(SPEC_STATUSES).toHaveProperty(key)
            })
        })
    })

    describe('STATUS_CONFIGS', () => {
        it('should have config for each status', () => {
            Object.keys(SPEC_STATUSES).forEach((status) => {
                expect(STATUS_CONFIGS).toHaveProperty(status)
            })
        })

        it('should have required properties for each config', () => {
            Object.values(STATUS_CONFIGS).forEach((config) => {
                expect(config).toHaveProperty('icon')
                expect(config).toHaveProperty('color')
                expect(config).toHaveProperty('label')
                expect(config).toHaveProperty('badgeClassName')
                expect(config).toHaveProperty('requirementClassName')
            })
        })

        it('should have correct labels', () => {
            expect(STATUS_CONFIGS.passed.label).toBe('Passed')
            expect(STATUS_CONFIGS.failed.label).toBe('Failed')
            expect(STATUS_CONFIGS.pending.label).toBe('Pending')
        })
    })
})
