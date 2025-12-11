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
import { oc } from '@orpc/contract'

// FIXME: almost all contract schemes are bullshit here

const getTestFolderContract = oc
    .route({
        method: 'GET',
        path: '/test-folders/{id}',
        tags: ['tests', 'folders'],
        description: 'Get a test folder by its ID'
    })
    .input(testFolderInsertSchema.pick({ id: true }))
    .output(testFolderSelectSchema)

const listTestFoldersContract = oc
    .route({ method: 'GET', path: '/test-folders', tags: ['tests', 'folders'], description: 'List test folders' })
    .input(testFolderInsertSchema.pick({ parentFolderId: true }).partial({ parentFolderId: true }))
    .output(z.array(testFolderSelectSchema))

const getFolderChildrenContract = oc
    .route({
        method: 'GET',
        path: '/test-folders/{folderId}/children',
        tags: ['tests', 'folders'],
        description: 'Get the children of a test folder'
    })
    .input(
        z.object({
            folderId: testFolderSelectSchema.shape.id,
            depth: z.number().int().min(0).max(5).optional().default(0)
        })
    )
    .output(
        z.array(
            z.object({
                id: z.string(),
                name: z.string(),
                type: z.enum(['folder', 'spec']),
                children: z
                    .array(
                        z.object({
                            id: z.string(),
                            name: z.string(),
                            type: z.enum(['folder', 'spec'])
                        })
                    )
                    .optional()
            })
        )
    )

const findTestFolderByNameContract = oc
    .route({
        method: 'GET',
        path: '/test-folders/find',
        tags: ['tests', 'folders'],
        description: 'Find a test folder by name in the active organization'
    })
    .input(
        z.object({
            name: z.string().min(1)
        })
    )
    .output(testFolderSelectSchema.nullable())

const upsertTestFolderContract = oc
    .route({
        method: 'POST',
        path: '/test-folders/{id}',
        tags: ['tests', 'folders'],
        description: 'Create or update a test folder'
    })
    .input(testFolderInsertSchema.omit({ createdAt: true, updatedAt: true }))
    .output(testFolderSelectSchema)

const deleteTestFolderContract = oc
    .route({
        method: 'DELETE',
        path: '/test-folders/{id}',
        tags: ['tests', 'folders'],
        description: 'Delete a test folder'
    })
    .input(testFolderInsertSchema.pick({ id: true }))
    .output(z.object({ success: z.boolean() }))

const getTestSpecContract = oc
    .route({
        method: 'GET',
        path: '/test-specs/{id}',
        tags: ['tests', 'specs'],
        description: 'Get a test spec by its ID'
    })
    .input(testSpecInsertSchema.pick({ id: true }))
    .output(testSpecSelectSchema.nullable())

const listTestSpecsContract = oc
    .route({ method: 'GET', path: '/test-specs', tags: ['tests', 'specs'], description: 'List test specs' })
    .input(testSpecInsertSchema.pick({ folderId: true }).partial({ folderId: true }))
    .output(z.array(testSpecSelectSchema))

const upsertTestSpecContract = oc
    .route({
        method: 'PUT',
        path: '/test-specs/{id}',
        tags: ['tests', 'specs'],
        description: 'Create or update a test spec'
    })
    .input(testSpecInsertSchema.omit({ createdAt: true, updatedAt: true }))
    .output(testSpecInsertSchema)

const deleteTestSpecContract = oc
    .route({ method: 'DELETE', path: '/test-specs/{id}', tags: ['tests', 'specs'], description: 'Delete a test spec' })
    .input(testSpecInsertSchema.pick({ id: true }))
    .output(z.object({ success: z.boolean() }))

const listTestRequirementsContract = oc
    .route({
        method: 'GET',
        path: '/test-requirements',
        tags: ['tests', 'requirements'],
        description: 'List test requirements'
    })
    .input(testRequirementInsertSchema.pick({ specId: true }).partial({ specId: true }))
    .output(z.array(testRequirementSelectSchema))

const upsertTestRequirementContract = oc
    .route({
        method: 'PUT',
        path: '/test-requirements/{id}',
        tags: ['tests', 'requirements'],
        description: 'Create or update a test requirement'
    })
    .input(testRequirementInsertSchema.omit({ createdAt: true, updatedAt: true }))
    .output(testRequirementInsertSchema)

const deleteTestRequirementContract = oc
    .route({
        method: 'DELETE',
        path: '/test-requirements/{id}',
        tags: ['tests', 'requirements'],
        description: 'Delete a test requirement'
    })
    .input(testRequirementInsertSchema.pick({ id: true }))
    .output(z.object({ success: z.boolean() }))

const listTestsContract = oc
    .route({ method: 'GET', path: '/tests', tags: ['tests'], description: 'List tests' })
    .input(testInsertSchema.pick({ requirementId: true }).partial({ requirementId: true }))
    .output(z.array(testSelectSchema))

const upsertTestContract = oc
    .route({ method: 'PUT', path: '/tests/{id}', tags: ['tests'], description: 'Create or update a test' })
    .input(testInsertSchema.omit({ createdAt: true, updatedAt: true }))
    .output(testInsertSchema)

const deleteTestContract = oc
    .route({ method: 'DELETE', path: '/tests/{id}', tags: ['tests'], description: 'Delete a test' })
    .input(testInsertSchema.pick({ id: true }))
    .output(z.object({ success: z.boolean() }))

const syncReportContract = oc
    .route({ method: 'POST', path: '/tests/sync-report', tags: ['tests'], description: 'Sync the test report' })
    .input(vitestReportSchema.optional())
    .output(z.object({ updated: z.number(), missing: z.number() }))

const getReportContract = oc
    .route({ method: 'GET', path: '/tests/report', tags: ['tests'], description: 'Get the test report' })
    .output(vitestReportSchema)

export const testsContract = {
    testFolders: {
        get: getTestFolderContract,
        list: listTestFoldersContract,
        getChildren: getFolderChildrenContract,
        findByName: findTestFolderByNameContract,
        upsert: upsertTestFolderContract,
        delete: deleteTestFolderContract
    },
    testSpecs: {
        get: getTestSpecContract,
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
        syncReport: syncReportContract,
        getReport: getReportContract
    }
}
