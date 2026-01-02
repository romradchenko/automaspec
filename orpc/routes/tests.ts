import { implement } from '@orpc/server'
import { ORPCError } from '@orpc/server'
import { asc, eq, and, inArray, isNull, notInArray, sql } from 'drizzle-orm'

import type { TestStatus, SpecStatus, VitestTestResult, TestFolder, TestRequirementUpsertValue } from '@/lib/types'

import { db } from '@/db'
import { testFolder, testSpec, testRequirement, test } from '@/db/schema'
import { TEST_STATUSES, SPEC_STATUSES } from '@/lib/constants'
import { testsContract } from '@/orpc/contracts/tests'
import { authMiddleware, organizationMiddleware } from '@/orpc/middleware'
import testResultsData from '@/test-results.json'

const os = implement(testsContract).use(authMiddleware).use(organizationMiddleware)

const getTestFolder = os.testFolders.get.handler(async ({ input, context }) => {
    const folder = await db
        .select()
        .from(testFolder)
        .where(and(eq(testFolder.id, input.id), eq(testFolder.organizationId, context.organizationId)))
        .limit(1)

    if (!folder || folder.length === 0) {
        throw new ORPCError('Folder not found')
    }

    return folder[0]
})

const listTestFolders = os.testFolders.list.handler(async ({ context, input }) => {
    const conditions = [eq(testFolder.organizationId, context.organizationId)]

    if (input.parentFolderId !== undefined) {
        if (input.parentFolderId === null) {
            conditions.push(isNull(testFolder.parentFolderId))
        } else {
            conditions.push(eq(testFolder.parentFolderId, input.parentFolderId))
        }
    }

    return await db
        .select()
        .from(testFolder)
        .where(and(...conditions))
})

const getFolderChildren = os.testFolders.getChildren.handler(async ({ input, context }) => {
    const { folderId, depth = 0 } = input

    async function fetchChildren(
        parentId: TestFolder['id'],
        currentDepth: number
    ): Promise<
        Array<{
            id: TestFolder['id']
            name: string
            type: 'folder' | 'spec'
            children?: Array<{ id: TestFolder['id']; name: string; type: 'folder' | 'spec' }>
        }>
    > {
        let folders
        let specs

        if (parentId === 'root') {
            folders = await db
                .select({ id: testFolder.id, name: testFolder.name })
                .from(testFolder)
                .where(and(eq(testFolder.organizationId, context.organizationId), isNull(testFolder.parentFolderId)))

            specs = await db
                .select({ id: testSpec.id, name: testSpec.name })
                .from(testSpec)
                .where(and(eq(testSpec.organizationId, context.organizationId), isNull(testSpec.folderId)))
        } else {
            folders = await db
                .select({ id: testFolder.id, name: testFolder.name })
                .from(testFolder)
                .where(
                    and(eq(testFolder.organizationId, context.organizationId), eq(testFolder.parentFolderId, parentId))
                )

            specs = await db
                .select({ id: testSpec.id, name: testSpec.name })
                .from(testSpec)
                .where(and(eq(testSpec.organizationId, context.organizationId), eq(testSpec.folderId, parentId)))
        }

        const result: Array<{
            id: string
            name: string
            type: 'folder' | 'spec'
            children?: Array<{ id: string; name: string; type: 'folder' | 'spec' }>
        }> = []

        if (currentDepth < depth) {
            for (const folder of folders) {
                const children = await fetchChildren(folder.id, currentDepth + 1)
                result.push({
                    id: folder.id,
                    name: folder.name,
                    type: 'folder' as const,
                    children: children.length > 0 ? children : undefined
                })
            }
        } else {
            for (const folder of folders) {
                result.push({ id: folder.id, name: folder.name, type: 'folder' as const })
            }
        }

        for (const spec of specs) {
            result.push({ id: spec.id, name: spec.name, type: 'spec' as const })
        }

        return result
    }

    return await fetchChildren(folderId, depth)
})

const findTestFolderByName = os.testFolders.findByName.handler(async ({ input, context }) => {
    const folder = await db
        .select()
        .from(testFolder)
        .where(and(eq(testFolder.organizationId, context.organizationId), eq(testFolder.name, input.name)))
        .limit(1)

    if (!folder || folder.length === 0) {
        return null
    }

    return folder[0]
})

const upsertTestFolder = os.testFolders.upsert.handler(async ({ input, context }) => {
    const { id = crypto.randomUUID(), ...updates } = input

    const result = await db
        .insert(testFolder)
        .values({ id, ...updates, organizationId: context.organizationId })
        .onConflictDoUpdate({
            target: testFolder.id,
            set: { ...updates }
        })
        .returning()

    return result[0]
})

const editTestFolder = os.testFolders.edit.handler(async ({ input, context }) => {
    const result = await db
        .update(testFolder)
        .set({
            name: input.name,
            description: input.description,
            parentFolderId: input.parentFolderId,
            order: input.order
        })
        .where(and(eq(testFolder.id, input.id), eq(testFolder.organizationId, context.organizationId)))
        .returning()

    if (!result || result.length === 0) {
        throw new ORPCError('Folder not found')
    }

    return result[0]
})

const deleteTestFolder = os.testFolders.delete.handler(async ({ input, context }) => {
    const organizationId = context.organizationId

    const deletedFolder = await db
        .delete(testFolder)
        .where(and(eq(testFolder.id, input.id), eq(testFolder.organizationId, organizationId)))
        .returning({
            id: testFolder.id
        })

    if (!deletedFolder || deletedFolder.length === 0) {
        return { success: false }
    }

    return { success: true }
})

const getTestSpec = os.testSpecs.get.handler(async ({ input, context }) => {
    const spec = await db
        .select()
        .from(testSpec)
        .where(and(eq(testSpec.id, input.id), eq(testSpec.organizationId, context.organizationId)))
        .limit(1)

    if (!spec || spec.length === 0) {
        return null
    }

    return spec[0]
})

const listTestSpecs = os.testSpecs.list.handler(async ({ context, input }) => {
    const organizationId = context.organizationId
    const conditions = [eq(testSpec.organizationId, organizationId)]

    if (input.folderId !== undefined) {
        if (input.folderId === null) {
            conditions.push(isNull(testSpec.folderId))
        } else {
            conditions.push(eq(testSpec.folderId, input.folderId))
        }
    }

    return await db
        .select()
        .from(testSpec)
        .where(and(...conditions))
})

const upsertTestSpec = os.testSpecs.upsert.handler(async ({ input }) => {
    const { id = crypto.randomUUID(), ...updates } = input

    const result = await db
        .insert(testSpec)
        .values({
            id,
            ...updates
        })
        .onConflictDoUpdate({
            target: testSpec.id,
            set: {
                ...updates
            }
        })
        .returning()

    return result[0]
})

const editTestSpec = os.testSpecs.edit.handler(async ({ input, context }) => {
    const result = await db
        .update(testSpec)
        .set({
            name: input.name,
            fileName: input.fileName,
            description: input.description,
            folderId: input.folderId
        })
        .where(and(eq(testSpec.id, input.id), eq(testSpec.organizationId, context.organizationId)))
        .returning()

    if (!result || result.length === 0) {
        throw new ORPCError('Spec not found')
    }

    return result[0]
})

const deleteTestSpec = os.testSpecs.delete.handler(async ({ input, context }) => {
    const organizationId = context.organizationId

    const spec = await db
        .select({ id: testSpec.id, organizationId: testSpec.organizationId })
        .from(testSpec)
        .where(eq(testSpec.id, input.id))
        .limit(1)

    if (!spec || spec.length === 0 || spec[0].organizationId !== organizationId) {
        throw new ORPCError('Spec not found or access denied')
    }
    await db.delete(testSpec).where(eq(testSpec.id, input.id))
    return { success: true }
})

const listTests = os.tests.list.handler(async ({ context, input }) => {
    const organizationId = context.organizationId

    const conditions = [eq(testSpec.organizationId, organizationId)]

    if (input.requirementId) {
        conditions.push(eq(test.requirementId, input.requirementId))
    }

    return await db
        .select({
            id: test.id,
            status: test.status,
            framework: test.framework,
            code: test.code,
            requirementId: test.requirementId,
            createdAt: test.createdAt,
            updatedAt: test.updatedAt
        })
        .from(test)
        .innerJoin(testRequirement, eq(test.requirementId, testRequirement.id))
        .innerJoin(testSpec, eq(testRequirement.specId, testSpec.id))
        .where(and(...conditions))
})

const upsertTest = os.tests.upsert.handler(async ({ input }) => {
    const { id = crypto.randomUUID(), ...updates } = input
    const result = await db
        .insert(test)
        .values({
            id,
            ...updates,
            status: updates.status,
            framework: updates.framework
        })
        .onConflictDoUpdate({
            target: test.id,
            set: {
                ...updates,
                status: updates.status,
                framework: updates.framework
            }
        })
        .returning()

    return result[0]
})

const editTest = os.tests.edit.handler(async ({ input, context }) => {
    const organizationId = context.organizationId

    const requirementIds = db
        .select({ id: testRequirement.id })
        .from(testRequirement)
        .innerJoin(testSpec, eq(testRequirement.specId, testSpec.id))
        .where(eq(testSpec.organizationId, organizationId))

    const result = await db
        .update(test)
        .set({
            status: input.status,
            code: input.code
        })
        .where(and(eq(test.id, input.id), inArray(test.requirementId, requirementIds)))
        .returning()

    if (!result || result.length === 0) {
        throw new ORPCError('Test not found')
    }

    return result[0]
})

const deleteTest = os.tests.delete.handler(async ({ input }) => {
    await db.delete(test).where(eq(test.id, input.id))
    return { success: true }
})

const listTestRequirements = os.testRequirements.list.handler(async ({ input, context }) => {
    const organizationId = context.organizationId
    const conditions = [eq(testSpec.organizationId, organizationId)]

    if (input.specId) {
        conditions.push(eq(testRequirement.specId, input.specId))
    }

    return await db
        .select({
            id: testRequirement.id,
            name: testRequirement.name,
            description: testRequirement.description,
            order: testRequirement.order,
            specId: testRequirement.specId,
            createdAt: testRequirement.createdAt,
            updatedAt: testRequirement.updatedAt
        })
        .from(testRequirement)
        .innerJoin(testSpec, eq(testRequirement.specId, testSpec.id))
        .where(and(...conditions))
})

const upsertTestRequirement = os.testRequirements.upsert.handler(async ({ input, context }) => {
    const { id = crypto.randomUUID(), ...updates } = input
    const organizationId = context.organizationId

    const spec = await db
        .select({ id: testSpec.id, organizationId: testSpec.organizationId })
        .from(testSpec)
        .where(eq(testSpec.id, updates.specId))
        .limit(1)

    if (!spec || spec.length === 0 || spec[0].organizationId !== organizationId) {
        throw new ORPCError('Spec not found or access denied')
    }

    const result = await db
        .insert(testRequirement)
        .values({
            id,
            ...updates
        })
        .onConflictDoUpdate({
            target: testRequirement.id,
            set: { ...updates }
        })
        .returning()

    return result[0]
})

const editTestRequirement = os.testRequirements.edit.handler(async ({ input, context }) => {
    const organizationId = context.organizationId

    const result = await db
        .update(testRequirement)
        .set({
            name: input.name,
            description: input.description,
            order: input.order
        })
        .where(
            and(
                eq(testRequirement.id, input.id),
                inArray(
                    testRequirement.specId,
                    db.select({ id: testSpec.id }).from(testSpec).where(eq(testSpec.organizationId, organizationId))
                )
            )
        )
        .returning()

    if (!result || result.length === 0) {
        throw new ORPCError('Requirement not found or access denied')
    }

    return result[0]
})

const replaceTestRequirementsForSpec = os.testRequirements.replaceForSpec.handler(async ({ input, context }) => {
    const organizationId = context.organizationId

    const spec = await db
        .select({ id: testSpec.id })
        .from(testSpec)
        .where(and(eq(testSpec.id, input.specId), eq(testSpec.organizationId, organizationId)))
        .limit(1)

    if (!spec || spec.length === 0) {
        throw new ORPCError('Spec not found or access denied')
    }

    const inputIds: string[] = []
    for (const requirement of input.requirements) {
        if (requirement.id) {
            inputIds.push(requirement.id)
        }
    }

    if (inputIds.length > 0) {
        const existing = await db
            .select({ id: testRequirement.id, specId: testRequirement.specId })
            .from(testRequirement)
            .where(inArray(testRequirement.id, inputIds))

        for (const requirement of existing) {
            if (requirement.specId !== input.specId) {
                throw new ORPCError('Requirement does not belong to the selected spec')
            }
        }
    }

    const values: TestRequirementUpsertValue[] = []
    for (const requirement of input.requirements) {
        values.push({
            id: requirement.id ?? crypto.randomUUID(),
            name: requirement.name,
            description: requirement.description ?? null,
            order: requirement.order,
            specId: input.specId
        })
    }

    if (values.length > 0) {
        await db
            .insert(testRequirement)
            .values(values)
            .onConflictDoUpdate({
                target: testRequirement.id,
                set: {
                    name: sql.raw('excluded.name'),
                    description: sql.raw('excluded.description'),
                    order: sql.raw('excluded."order"'),
                    specId: sql.raw('excluded.spec_id')
                }
            })
    }

    const keepIds: string[] = []
    for (const value of values) {
        keepIds.push(value.id)
    }

    if (keepIds.length === 0) {
        await db.delete(testRequirement).where(eq(testRequirement.specId, input.specId))
    } else {
        await db
            .delete(testRequirement)
            .where(and(eq(testRequirement.specId, input.specId), notInArray(testRequirement.id, keepIds)))
    }

    const specTests = await db
        .select({ status: test.status })
        .from(test)
        .innerJoin(testRequirement, eq(test.requirementId, testRequirement.id))
        .innerJoin(testSpec, eq(testRequirement.specId, testSpec.id))
        .where(and(eq(testSpec.organizationId, organizationId), eq(testSpec.id, input.specId)))

    const counts = {} as Record<SpecStatus, number>
    for (const status of Object.values(SPEC_STATUSES)) {
        counts[status as SpecStatus] = 0
    }

    for (const row of specTests) {
        if (row.status in counts) {
            counts[row.status as SpecStatus] += 1
        }
    }

    await db
        .update(testSpec)
        .set({ statuses: counts, numberOfTests: specTests.length })
        .where(and(eq(testSpec.id, input.specId), eq(testSpec.organizationId, organizationId)))

    return await db
        .select()
        .from(testRequirement)
        .where(eq(testRequirement.specId, input.specId))
        .orderBy(asc(testRequirement.order))
})

const deleteTestRequirement = os.testRequirements.delete.handler(async ({ input, context }) => {
    const organizationId = context.organizationId

    const requirement = await db
        .select({ id: testRequirement.id, specId: testRequirement.specId })
        .from(testRequirement)
        .innerJoin(testSpec, eq(testRequirement.specId, testSpec.id))
        .where(and(eq(testRequirement.id, input.id), eq(testSpec.organizationId, organizationId)))
        .limit(1)

    if (!requirement || requirement.length === 0) {
        throw new ORPCError('Requirement not found or access denied')
    }

    await db.delete(testRequirement).where(eq(testRequirement.id, input.id))
    return { success: true }
})

const getReport = os.tests.getReport.handler(async () => {
    return testResultsData
})

const syncReport = os.tests.syncReport.handler(async ({ input, context }) => {
    const titleToStatus: Record<string, TestStatus> = {}
    const report = input || testResultsData

    if (report.testResults) {
        for (const result of report.testResults as VitestTestResult[]) {
            if (result.assertionResults) {
                for (const assertion of result.assertionResults) {
                    if (assertion.title && assertion.status) {
                        titleToStatus[assertion.title.toLowerCase()] = assertion.status as TestStatus
                    }
                }
            }
        }
    }

    const orgTests = await db
        .select({
            testId: test.id,
            testStatus: test.status,
            requirementName: testRequirement.name,
            specId: testSpec.id
        })
        .from(test)
        .innerJoin(testRequirement, eq(test.requirementId, testRequirement.id))
        .innerJoin(testSpec, eq(testRequirement.specId, testSpec.id))
        .where(eq(testSpec.organizationId, context.organizationId))

    const matchedIds: string[] = []
    const updatesByStatus: Record<TestStatus, string[]> = {
        passed: [],
        failed: [],
        skipped: [],
        todo: [],
        pending: [],
        disabled: [],
        missing: []
    }
    let updatedCount = 0

    for (const orgTest of orgTests) {
        const reportedStatus = titleToStatus[orgTest.requirementName.toLowerCase()]
        if (reportedStatus) {
            matchedIds.push(orgTest.testId)
            if (orgTest.testStatus !== reportedStatus) {
                updatesByStatus[reportedStatus].push(orgTest.testId)
                updatedCount++
            }
        }
    }

    const matchedSet = new Set(matchedIds)
    const missingIds: string[] = []
    for (const t of orgTests) {
        if (!matchedSet.has(t.testId)) {
            missingIds.push(t.testId)
        }
    }

    const updateTasks: Array<Promise<unknown>> = []
    for (const status of Object.keys(updatesByStatus) as TestStatus[]) {
        const ids = updatesByStatus[status]
        if (ids.length > 0) {
            updateTasks.push(db.update(test).set({ status }).where(inArray(test.id, ids)))
        }
    }
    if (updateTasks.length > 0) {
        await Promise.all(updateTasks)
    }

    if (missingIds.length > 0) {
        await db
            .update(test)
            .set({ status: TEST_STATUSES.missing as TestStatus })
            .where(inArray(test.id, missingIds))
    }

    const affectedSpecIdSet = new Set<string>()
    for (const t of orgTests) {
        affectedSpecIdSet.add(t.specId)
    }
    const affectedSpecIds = Array.from(affectedSpecIdSet)

    const allSpecTests =
        affectedSpecIds.length === 0
            ? []
            : await db
                  .select({
                      specId: testRequirement.specId,
                      status: test.status
                  })
                  .from(test)
                  .innerJoin(testRequirement, eq(test.requirementId, testRequirement.id))
                  .innerJoin(testSpec, eq(testRequirement.specId, testSpec.id))
                  .where(
                      and(eq(testSpec.organizationId, context.organizationId), inArray(testSpec.id, affectedSpecIds))
                  )

    const specData: Record<string, { counts: Record<SpecStatus, number>; total: number }> = {}

    for (const specId of affectedSpecIds) {
        const counts = {} as Record<SpecStatus, number>
        for (const status of Object.values(SPEC_STATUSES)) {
            counts[status as SpecStatus] = 0
        }
        specData[specId] = {
            counts,
            total: 0
        }
    }

    for (const t of allSpecTests) {
        if (specData[t.specId] && t.status in specData[t.specId].counts) {
            specData[t.specId].counts[t.status as SpecStatus]++
            specData[t.specId].total++
        }
    }

    if (affectedSpecIds.length > 0) {
        const specUpdateTasks: Array<Promise<unknown>> = []
        for (const sid of affectedSpecIds) {
            specUpdateTasks.push(
                db
                    .update(testSpec)
                    .set({
                        statuses: specData[sid].counts as Record<SpecStatus, number>,
                        numberOfTests: specData[sid].total
                    })
                    .where(eq(testSpec.id, sid))
            )
        }
        await Promise.all(specUpdateTasks)
    }

    return { updated: updatedCount, missing: missingIds.length }
})

export const testsRouter = {
    testFolders: {
        get: getTestFolder,
        list: listTestFolders,
        getChildren: getFolderChildren,
        findByName: findTestFolderByName,
        upsert: upsertTestFolder,
        edit: editTestFolder,
        delete: deleteTestFolder
    },
    testSpecs: {
        get: getTestSpec,
        list: listTestSpecs,
        upsert: upsertTestSpec,
        edit: editTestSpec,
        delete: deleteTestSpec
    },
    testRequirements: {
        list: listTestRequirements,
        upsert: upsertTestRequirement,
        edit: editTestRequirement,
        replaceForSpec: replaceTestRequirementsForSpec,
        delete: deleteTestRequirement
    },
    tests: {
        list: listTests,
        upsert: upsertTest,
        edit: editTest,
        delete: deleteTest,
        syncReport: syncReport,
        getReport: getReport
    }
}
