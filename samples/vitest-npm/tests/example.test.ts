import { describe, it, expect } from 'vitest'

describe('Math Operations', () => {
    it('should add two numbers correctly', () => {
        expect(2 + 2).toBe(4)
    })

    it('should subtract two numbers correctly', () => {
        expect(10 - 5).toBe(5)
    })

    it('should multiply two numbers correctly', () => {
        expect(3 * 4).toBe(12)
    })
})

describe('Array Operations', () => {
    it('should check if array contains element', () => {
        const fruits = ['apple', 'banana', 'orange']
        expect(fruits).toContain('banana')
    })

    it('should return correct array length', () => {
        const numbers = [1, 2, 3, 4, 5]
        expect(numbers).toHaveLength(5)
    })
})
