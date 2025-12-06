import { createSelectSchema, createInsertSchema } from 'drizzle-zod'
import * as z from 'zod'

import * as schema from '@/db/schema'

import type { authClient } from './shared/better-auth-client'

import {
    TEST_STATUSES,
    SPEC_STATUSES,
    TEST_FRAMEWORK,
    ORGANIZATION_PLANS,
    ANALYTICS_PERIODS,
    type MEMBER_ROLES
} from './constants'

// FIXME: will work after https://github.com/drizzle-team/drizzle-orm/pull/4820, removing all manual zod coercions
// const { createInsertSchema, createSelectSchema } = createSchemaFactory({
//     coerce: {
//       date: true
//     }
// });

export const testFolderSelectSchema = createSelectSchema(schema.testFolder, {
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date()
})
export const testFolderInsertSchema = createInsertSchema(schema.testFolder, {
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date()
})
export const testSpecSelectSchema = createSelectSchema(schema.testSpec, {
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date()
})
export const testSpecInsertSchema = createInsertSchema(schema.testSpec, {
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date()
})
export const testRequirementSelectSchema = createSelectSchema(schema.testRequirement, {
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date()
})
export const testRequirementInsertSchema = createInsertSchema(schema.testRequirement, {
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date()
})
export const testSelectSchema = createSelectSchema(schema.test, {
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date()
})
export const testInsertSchema = createInsertSchema(schema.test, {
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    status: z.enum(TEST_STATUSES),
    framework: z.literal(TEST_FRAMEWORK)
})

export type TestFramework = typeof TEST_FRAMEWORK
export type OrganizationPlan = keyof typeof ORGANIZATION_PLANS
export type TestStatus = keyof typeof TEST_STATUSES
export type SpecStatus = keyof typeof SPEC_STATUSES
export type TestFolder = z.infer<typeof testFolderSelectSchema>
export type TestSpec = z.infer<typeof testSpecSelectSchema>
export type TestRequirement = z.infer<typeof testRequirementSelectSchema>
export type Test = z.infer<typeof testSelectSchema>

// Frontend types
export interface FolderWithChildren extends TestFolder {
    folders: FolderWithChildren[]
    specs: TestSpec[]
}

// I check correct types up to here

// Form input types
export type CreateTestFolderInput = Omit<TestFolder, 'id' | 'createdAt' | 'updatedAt'>
export type CreateTestSpecInput = Omit<TestSpec, 'id' | 'createdAt' | 'updatedAt'>
export type CreateTestInput = Omit<Test, 'id' | 'createdAt' | 'updatedAt'>
export type CreateTestRequirementInput = Omit<TestRequirement, 'id' | 'createdAt' | 'updatedAt'>

// Use organization types directly from database schema
export const organizationSelectSchema = createSelectSchema(schema.organization).meta({
    description: 'Organization data'
})
export const memberSelectSchema = createSelectSchema(schema.member).meta({
    description: 'Member data'
})
export const invitationSelectSchema = createSelectSchema(schema.invitation).meta({
    description: 'Invitation data'
})
export type Organization = z.infer<typeof organizationSelectSchema>
export type Member = z.infer<typeof memberSelectSchema>
export type MemberRole = keyof typeof MEMBER_ROLES
export type Invitation = z.infer<typeof invitationSelectSchema>
// Session has user and session
export type Session = typeof authClient.$Infer.Session
export type User = Session['user']

// Update input types
export type UpdateTestFolderInput = { id: string } & Partial<CreateTestFolderInput>
export type UpdateTestSpecInput = { id: string } & Partial<CreateTestSpecInput>
export type UpdateTestInput = { id: string } & Partial<CreateTestInput>

// Organization input types (using Drizzle's InferInsertModel)
export const organizationInsertSchema = createInsertSchema(schema.organization)
export const memberInsertSchema = createInsertSchema(schema.member)
export const invitationInsertSchema = createInsertSchema(schema.invitation)
export type CreateOrganizationInput = z.infer<typeof organizationInsertSchema>
export type CreateMemberInput = z.infer<typeof memberInsertSchema>
export type CreateInvitationInput = z.infer<typeof invitationInsertSchema>

export const vitestAssertionSchema = z.object({
    title: z.string().optional(),
    status: z.string().optional()
})

export const vitestTestResultSchema = z.object({
    assertionResults: z.array(vitestAssertionSchema).optional()
})

export const vitestReportSchema = z.object({
    testResults: z.array(vitestTestResultSchema).optional()
})

export type VitestAssertion = z.infer<typeof vitestAssertionSchema>
export type VitestTestResult = z.infer<typeof vitestTestResultSchema>
export type VitestReport = z.infer<typeof vitestReportSchema>

export type AnalyticsPeriod = keyof typeof ANALYTICS_PERIODS

export const analyticsMetricsInputSchema = z.object({
    period: z.enum(['7d', '30d', '90d'])
})

export const testsGrowthItemSchema = z.object({
    date: z.string(),
    count: z.number()
})

export const staleTestSchema = z.object({
    id: z.string(),
    name: z.string(),
    updatedAt: z.string()
})

export const analyticsMetricsOutputSchema = z.object({
    totalTests: z.number(),
    totalRequirements: z.number(),
    totalSpecs: z.number(),
    activeMembers: z.number(),
    testsByStatus: z.record(z.string(), z.number()),
    testsGrowth: z.array(testsGrowthItemSchema),
    staleTests: z.array(staleTestSchema)
})

export type AnalyticsMetricsInput = z.infer<typeof analyticsMetricsInputSchema>
export type AnalyticsMetricsOutput = z.infer<typeof analyticsMetricsOutputSchema>
export type TestsGrowthItem = z.infer<typeof testsGrowthItemSchema>
export type StaleTest = z.infer<typeof staleTestSchema>
