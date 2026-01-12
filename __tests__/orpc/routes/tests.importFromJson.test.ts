import { createRouterClient } from '@orpc/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
    testFolder as testFolderTable,
    testSpec as testSpecTable,
    testRequirement as testRequirementTable,
    test as testTable
} from '@/db/schema'
import { TEST_STATUSES } from '@/lib/constants'
import { router } from '@/orpc/routes'

const dbMocks = vi.hoisted(() => {
    const insertedItems: Array<{ table: unknown; values: unknown }> = []
    const updatedItems: Array<{ table: unknown }> = []

    const update = vi.fn((_table: unknown) => {
        updatedItems.push({ table: _table })
        return {
            set: () => ({
                where: async () => Promise.resolve(undefined)
            })
        }
    })

    const insert = vi.fn((table: unknown) => ({
        values: async (vals: unknown) => {
            insertedItems.push({ table, values: vals })
            return Promise.resolve(undefined)
        }
    }))

    const createThenableWithLimit = async () => {
        const result: unknown[] = []
        const promise = Promise.resolve(result)
        return Object.assign(promise, {
            limit: async () => Promise.resolve(result)
        })
    }

    const createQueryResult = (): Record<string, unknown> => ({
        innerJoin: () => createQueryResult(),
        where: async () => createThenableWithLimit(),
        limit: async () => Promise.resolve([])
    })

    const select = vi.fn(() => ({
        from: () => createQueryResult()
    }))

    const reset = () => {
        update.mockClear()
        select.mockClear()
        insert.mockClear()
        insertedItems.length = 0
        updatedItems.length = 0
    }

    const getInsertedItems = () => insertedItems
    const getUpdatedItems = () => updatedItems

    return { update, select, insert, reset, getInsertedItems, getUpdatedItems }
})

vi.mock('@/db', () => {
    return { db: { update: dbMocks.update, select: dbMocks.select, insert: dbMocks.insert }, __esModule: true }
})

describe('importFromJson', () => {
    const ctx = {
        organizationId: 'org-1',
        session: {
            session: {
                activeOrganizationId: 'org-1',
                userId: 'user-1'
            },
            user: { id: 'user-1' }
        }
    }
    const testClient = createRouterClient(router, { context: async () => ctx })

    beforeEach(() => {
        dbMocks.reset()
    })

    it('returns zero counts for empty report', async () => {
        const report = { testResults: [] }
        const result = await testClient.tests.importFromJson(report)

        expect(result).toEqual({
            foldersCreated: 0,
            specsCreated: 0,
            requirementsCreated: 0,
            testsCreated: 0
        })
    })

    it('returns zero counts for undefined testResults', async () => {
        const report = {}
        const result = await testClient.tests.importFromJson(report)

        expect(result).toEqual({
            foldersCreated: 0,
            specsCreated: 0,
            requirementsCreated: 0,
            testsCreated: 0
        })
    })

    it('creates folders from file paths', async () => {
        const report = {
            testResults: [
                {
                    name: '__tests__/lib/utils.test.ts',
                    assertionResults: [{ title: 'should work', status: TEST_STATUSES.passed }]
                }
            ]
        }

        const result = await testClient.tests.importFromJson(report)

        expect(result.foldersCreated).toBe(1)

        const insertCalls = dbMocks.insert.mock.calls
        const folderInserts = insertCalls.filter((call) => call[0] === testFolderTable)
        expect(folderInserts.length).toBe(1)
    })

    it('creates specs from file names', async () => {
        const report = {
            testResults: [
                {
                    name: 'user-service.test.ts',
                    assertionResults: [{ title: 'handles login', status: TEST_STATUSES.passed }]
                }
            ]
        }

        const result = await testClient.tests.importFromJson(report)

        expect(result.specsCreated).toBe(1)

        const insertCalls = dbMocks.insert.mock.calls
        const specInserts = insertCalls.filter((call) => call[0] === testSpecTable)
        expect(specInserts.length).toBe(1)
    })

    it('creates requirements from assertion titles', async () => {
        const report = {
            testResults: [
                {
                    name: 'utils.test.ts',
                    assertionResults: [
                        { title: 'first test', status: TEST_STATUSES.passed },
                        { title: 'second test', status: TEST_STATUSES.failed }
                    ]
                }
            ]
        }

        const result = await testClient.tests.importFromJson(report)

        expect(result.requirementsCreated).toBe(2)

        const insertCalls = dbMocks.insert.mock.calls
        const reqInserts = insertCalls.filter((call) => call[0] === testRequirementTable)
        expect(reqInserts.length).toBe(1)

        const insertedReqs = dbMocks.getInsertedItems().filter((item) => item.table === testRequirementTable)
        expect(insertedReqs.length).toBe(1)
        expect((insertedReqs[0].values as unknown[]).length).toBe(2)
    })

    it('creates tests linked to requirements', async () => {
        const report = {
            testResults: [
                {
                    name: 'utils.test.ts',
                    assertionResults: [{ title: 'some test', status: TEST_STATUSES.passed }]
                }
            ]
        }

        const result = await testClient.tests.importFromJson(report)

        expect(result.testsCreated).toBe(1)

        const insertCalls = dbMocks.insert.mock.calls
        const testInserts = insertCalls.filter((call) => call[0] === testTable)
        expect(testInserts.length).toBe(1)
    })

    it('updates spec numberOfTests after import', async () => {
        const report = {
            testResults: [
                {
                    name: 'utils.test.ts',
                    assertionResults: [
                        { title: 'passes', status: TEST_STATUSES.passed },
                        { title: 'fails', status: TEST_STATUSES.failed }
                    ]
                }
            ]
        }

        await testClient.tests.importFromJson(report)

        const updateCalls = dbMocks.update.mock.calls
        const specUpdates = updateCalls.filter((call) => call[0] === testSpecTable)
        expect(specUpdates.length).toBeGreaterThanOrEqual(1)
    })

    it('skips tests without file name', async () => {
        const report = {
            testResults: [
                {
                    assertionResults: [{ title: 'some test', status: TEST_STATUSES.passed }]
                }
            ]
        }

        const result = await testClient.tests.importFromJson(report)

        expect(result).toEqual({
            foldersCreated: 0,
            specsCreated: 0,
            requirementsCreated: 0,
            testsCreated: 0
        })
    })

    it('skips assertions without title', async () => {
        const report = {
            testResults: [
                {
                    name: 'utils.test.ts',
                    assertionResults: [{ status: TEST_STATUSES.passed }]
                }
            ]
        }

        const result = await testClient.tests.importFromJson(report)

        expect(result.requirementsCreated).toBe(0)

        const insertCalls = dbMocks.insert.mock.calls
        const reqInserts = insertCalls.filter((call) => call[0] === testRequirementTable)
        expect(reqInserts.length).toBe(0)
    })

    it('creates nested folder structure', async () => {
        const report = {
            testResults: [
                {
                    name: '__tests__/lib/utils/helpers.test.ts',
                    assertionResults: [{ title: 'test', status: TEST_STATUSES.passed }]
                }
            ]
        }

        const result = await testClient.tests.importFromJson(report)

        expect(result.foldersCreated).toBe(2)
    })
})
