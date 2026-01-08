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

const getTestFolderContract = oc
    .route({
        method: 'GET',
        path: '/test-folders/{id}',
        tags: ['tests', 'folders'],
        summary: 'Get test folder',
        description: 'Get a test folder by its ID'
    })
    .input(testFolderInsertSchema.pick({ id: true }))
    .output(testFolderSelectSchema)

const listTestFoldersContract = oc
    .route({
        method: 'GET',
        path: '/test-folders',
        tags: ['tests', 'folders'],
        summary: 'List test folders',
        description: 'List test folders in the active organization (optionally filtered by parent folder)'
    })
    .input(testFolderInsertSchema.pick({ parentFolderId: true }).partial({ parentFolderId: true }))
    .output(z.array(testFolderSelectSchema))

const getFolderChildrenContract = oc
    .route({
        method: 'GET',
        path: '/test-folders/{folderId}/children',
        tags: ['tests', 'folders'],
        summary: 'Get folder children',
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
        summary: 'Find folder by name',
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
        summary: 'Create or update folder',
        description: 'Create or update a test folder'
    })
    .input(testFolderInsertSchema.omit({ createdAt: true, updatedAt: true }))
    .output(testFolderSelectSchema)

const editTestFolderContract = oc
    .route({
        method: 'PATCH',
        path: '/test-folders/{id}',
        tags: ['tests', 'folders'],
        summary: 'Edit test folder',
        description: 'Update fields of an existing test folder in the active organization'
    })
    .input(
        z
            .object({
                id: testFolderInsertSchema.shape.id,
                name: testFolderInsertSchema.shape.name.optional(),
                description: testFolderInsertSchema.shape.description.optional(),
                parentFolderId: testFolderInsertSchema.shape.parentFolderId.optional(),
                order: testFolderInsertSchema.shape.order.optional()
            })
            .refine(
                (input) =>
                    input.name !== undefined ||
                    input.description !== undefined ||
                    input.parentFolderId !== undefined ||
                    input.order !== undefined,
                { message: 'At least one field must be provided' }
            )
    )
    .output(testFolderSelectSchema)

const deleteTestFolderContract = oc
    .route({
        method: 'DELETE',
        path: '/test-folders/{id}',
        tags: ['tests', 'folders'],
        summary: 'Delete test folder',
        description: 'Delete a test folder'
    })
    .input(testFolderInsertSchema.pick({ id: true }))
    .output(z.object({ success: z.boolean() }))

const getTestSpecContract = oc
    .route({
        method: 'GET',
        path: '/test-specs/{id}',
        tags: ['tests', 'specs'],
        summary: 'Get test spec',
        description: 'Get a test spec by its ID'
    })
    .input(testSpecInsertSchema.pick({ id: true }))
    .output(testSpecSelectSchema.nullable())

const listTestSpecsContract = oc
    .route({
        method: 'GET',
        path: '/test-specs',
        tags: ['tests', 'specs'],
        summary: 'List test specs',
        description: 'List test specs in the active organization (optionally filtered by folder)'
    })
    .input(testSpecInsertSchema.pick({ folderId: true }).partial({ folderId: true }))
    .output(z.array(testSpecSelectSchema))

const upsertTestSpecContract = oc
    .route({
        method: 'PUT',
        path: '/test-specs/{id}',
        tags: ['tests', 'specs'],
        summary: 'Create or update spec',
        description: 'Create or update a test spec'
    })
    .input(testSpecInsertSchema.omit({ createdAt: true, updatedAt: true }))
    .output(testSpecInsertSchema)

const editTestSpecContract = oc
    .route({
        method: 'PATCH',
        path: '/test-specs/{id}',
        tags: ['tests', 'specs'],
        summary: 'Edit test spec',
        description: 'Update fields of an existing test spec in the active organization'
    })
    .input(
        z
            .object({
                id: testSpecInsertSchema.shape.id,
                name: testSpecInsertSchema.shape.name.optional(),
                fileName: testSpecInsertSchema.shape.fileName.optional(),
                description: testSpecInsertSchema.shape.description.optional(),
                folderId: testSpecInsertSchema.shape.folderId.optional()
            })
            .refine(
                (input) =>
                    input.name !== undefined ||
                    input.fileName !== undefined ||
                    input.description !== undefined ||
                    input.folderId !== undefined,
                { message: 'At least one field must be provided' }
            )
    )
    .output(testSpecSelectSchema)

const deleteTestSpecContract = oc
    .route({
        method: 'DELETE',
        path: '/test-specs/{id}',
        tags: ['tests', 'specs'],
        summary: 'Delete test spec',
        description: 'Delete a test spec'
    })
    .input(testSpecInsertSchema.pick({ id: true }))
    .output(z.object({ success: z.boolean() }))

const listTestRequirementsContract = oc
    .route({
        method: 'GET',
        path: '/test-requirements',
        tags: ['tests', 'requirements'],
        summary: 'List test requirements',
        description: 'List test requirements'
    })
    .input(testRequirementInsertSchema.pick({ specId: true }).partial({ specId: true }))
    .output(z.array(testRequirementSelectSchema))

const upsertTestRequirementContract = oc
    .route({
        method: 'PUT',
        path: '/test-requirements/{id}',
        tags: ['tests', 'requirements'],
        summary: 'Create or update requirement',
        description: 'Create or update a test requirement'
    })
    .input(testRequirementInsertSchema.omit({ createdAt: true, updatedAt: true }))
    .output(testRequirementInsertSchema)

const editTestRequirementContract = oc
    .route({
        method: 'PATCH',
        path: '/test-requirements/{id}',
        tags: ['tests', 'requirements'],
        summary: 'Edit test requirement',
        description: 'Update fields of an existing test requirement in the active organization'
    })
    .input(
        z
            .object({
                id: testRequirementInsertSchema.shape.id,
                name: testRequirementInsertSchema.shape.name.optional(),
                description: testRequirementInsertSchema.shape.description.optional(),
                order: testRequirementInsertSchema.shape.order.optional()
            })
            .refine(
                (input) => input.name !== undefined || input.description !== undefined || input.order !== undefined,
                { message: 'At least one field must be provided' }
            )
    )
    .output(testRequirementSelectSchema)

const replaceTestRequirementsForSpecContract = oc
    .route({
        method: 'PUT',
        path: '/test-specs/{specId}/requirements',
        tags: ['tests', 'requirements'],
        summary: 'Replace spec requirements',
        description: 'Upsert requirements for a spec and delete requirements that are missing from the request'
    })
    .input(
        z.object({
            specId: testSpecInsertSchema.shape.id,
            requirements: z.array(
                z.object({
                    id: testRequirementInsertSchema.shape.id.optional(),
                    name: testRequirementInsertSchema.shape.name,
                    description: testRequirementInsertSchema.shape.description.optional(),
                    order: z.number().int().min(0)
                })
            )
        })
    )
    .output(z.array(testRequirementSelectSchema))

const deleteTestRequirementContract = oc
    .route({
        method: 'DELETE',
        path: '/test-requirements/{id}',
        tags: ['tests', 'requirements'],
        summary: 'Delete test requirement',
        description: 'Delete a test requirement'
    })
    .input(testRequirementInsertSchema.pick({ id: true }))
    .output(z.object({ success: z.boolean() }))

const listTestsContract = oc
    .route({
        method: 'GET',
        path: '/tests',
        tags: ['tests'],
        summary: 'List tests',
        description: 'List tests in the active organization (optionally filtered by requirement)'
    })
    .input(testInsertSchema.pick({ requirementId: true }).partial({ requirementId: true }))
    .output(z.array(testSelectSchema))

const upsertTestContract = oc
    .route({
        method: 'PUT',
        path: '/tests/{id}',
        tags: ['tests'],
        summary: 'Create or update test',
        description: 'Create or update a test'
    })
    .input(testInsertSchema.omit({ createdAt: true, updatedAt: true }))
    .output(testInsertSchema)

const editTestContract = oc
    .route({
        method: 'PATCH',
        path: '/tests/{id}',
        tags: ['tests'],
        summary: 'Edit test',
        description: 'Update fields of an existing test in the active organization'
    })
    .input(
        z
            .object({
                id: testInsertSchema.shape.id,
                status: testInsertSchema.shape.status.optional(),
                code: testInsertSchema.shape.code.optional()
            })
            .refine((input) => input.status !== undefined || input.code !== undefined, {
                message: 'At least one field must be provided'
            })
    )
    .output(testSelectSchema)

const deleteTestContract = oc
    .route({
        method: 'DELETE',
        path: '/tests/{id}',
        tags: ['tests'],
        summary: 'Delete test',
        description: 'Delete a test'
    })
    .input(testInsertSchema.pick({ id: true }))
    .output(z.object({ success: z.boolean() }))

const syncReportContract = oc
    .route({
        method: 'POST',
        path: '/tests/sync-report',
        tags: ['tests'],
        summary: 'Sync test report',
        description: 'Sync the latest Vitest report and update test statuses'
    })
    .input(vitestReportSchema.optional())
    .output(z.object({ created: z.number(), updated: z.number(), missing: z.number() }))

const getReportContract = oc
    .route({
        method: 'GET',
        path: '/tests/report',
        tags: ['tests'],
        summary: 'Get test report',
        description: 'Get the test report'
    })
    .output(vitestReportSchema)

export const testsContract = {
    testFolders: {
        get: getTestFolderContract,
        list: listTestFoldersContract,
        getChildren: getFolderChildrenContract,
        findByName: findTestFolderByNameContract,
        upsert: upsertTestFolderContract,
        edit: editTestFolderContract,
        delete: deleteTestFolderContract
    },
    testSpecs: {
        get: getTestSpecContract,
        list: listTestSpecsContract,
        upsert: upsertTestSpecContract,
        edit: editTestSpecContract,
        delete: deleteTestSpecContract
    },
    testRequirements: {
        list: listTestRequirementsContract,
        upsert: upsertTestRequirementContract,
        edit: editTestRequirementContract,
        replaceForSpec: replaceTestRequirementsForSpecContract,
        delete: deleteTestRequirementContract
    },
    tests: {
        list: listTestsContract,
        upsert: upsertTestContract,
        edit: editTestContract,
        delete: deleteTestContract,
        syncReport: syncReportContract,
        getReport: getReportContract
    }
}
