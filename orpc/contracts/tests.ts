import { oc } from '@orpc/contract'
import * as z from 'zod'
import {
    testFolderSelectSchema,
    testFolderInsertSchema,
    testSpecSelectSchema,
    testSpecInsertSchema,
    testRequirementSelectSchema,
    testRequirementInsertSchema,
    testSelectSchema,
    testInsertSchema,
    vitestReportSchema
} from '@/lib/types'

// FIXME: almost all contract schemes are bullshit here

const getTestFolderContract = oc
    .route({ method: 'GET', path: '/test-folders/{id}' })
    .input(testFolderInsertSchema.pick({ id: true }))
    .output(testFolderSelectSchema)

const listTestFoldersContract = oc
    .route({ method: 'GET', path: '/test-folders' })
    .input(testFolderInsertSchema.pick({ parentFolderId: true }).partial({ parentFolderId: true }))
    .output(z.array(testFolderSelectSchema))

const upsertTestFolderContract = oc
    .route({ method: 'POST', path: '/test-folders/{id}' })
    .input(testFolderInsertSchema.omit({ createdAt: true, updatedAt: true }).partial({ id: true }))
    .output(testFolderInsertSchema)

const deleteTestFolderContract = oc
    .route({ method: 'DELETE', path: '/test-folders/{id}' })
    .input(testFolderInsertSchema.pick({ id: true }))
    .output(z.object({ success: z.boolean() }))

const listTestSpecsContract = oc
    .route({ method: 'GET', path: '/test-specs' })
    .input(testSpecInsertSchema.pick({ folderId: true }))
    .output(z.array(testSpecSelectSchema))

const upsertTestSpecContract = oc
    .route({ method: 'PUT', path: '/test-specs/{id}' })
    .input(testSpecInsertSchema.omit({ createdAt: true, updatedAt: true }))
    .output(testSpecInsertSchema)

const deleteTestSpecContract = oc
    .route({ method: 'DELETE', path: '/test-specs/{id}' })
    .input(testSpecInsertSchema.pick({ id: true }))
    .output(z.object({ success: z.boolean() }))

const listTestRequirementsContract = oc
    .route({ method: 'GET', path: '/test-requirements' })
    .input(testRequirementInsertSchema.pick({ specId: true }))
    .output(z.array(testRequirementSelectSchema))

const upsertTestRequirementContract = oc
    .route({ method: 'PUT', path: '/test-requirements/{id}' })
    .input(testRequirementInsertSchema.omit({ createdAt: true, updatedAt: true }))
    .output(testRequirementInsertSchema)

const deleteTestRequirementContract = oc
    .route({ method: 'DELETE', path: '/test-requirements/{id}' })
    .input(testRequirementInsertSchema.pick({ id: true }))
    .output(z.object({ success: z.boolean() }))

const listTestsContract = oc
    .route({ method: 'GET', path: '/tests' })
    .input(testInsertSchema.pick({ requirementId: true }))
    .output(z.array(testSelectSchema))

const upsertTestContract = oc
    .route({ method: 'PUT', path: '/tests/{id}' })
    .input(testInsertSchema.omit({ createdAt: true, updatedAt: true }))
    .output(testInsertSchema)

const deleteTestContract = oc
    .route({ method: 'DELETE', path: '/tests/{id}' })
    .input(testInsertSchema.pick({ id: true }))
    .output(z.object({ success: z.boolean() }))

const syncReportContract = oc
    .route({ method: 'POST', path: '/tests/sync-report' })
    .input(vitestReportSchema)
    .output(z.object({ updated: z.number(), missing: z.number() }))

export const testsContract = {
    testFolders: {
        get: getTestFolderContract,
        list: listTestFoldersContract,
        upsert: upsertTestFolderContract,
        delete: deleteTestFolderContract
    },
    testSpecs: {
        list: listTestSpecsContract,
        upsert: upsertTestSpecContract,
        delete: deleteTestSpecContract
    },
    testRequirements: {
        list: listTestRequirementsContract,
        upsert: upsertTestRequirementContract,
        delete: deleteTestRequirementContract
    },
    tests: {
        list: listTestsContract,
        upsert: upsertTestContract,
        delete: deleteTestContract,
        syncReport: syncReportContract
    }
}
