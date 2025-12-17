import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

import type { MemberRole, OrganizationPlan } from '@/lib/types'

export const account = sqliteTable('account', {
    id: text().primaryKey().notNull(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: text()
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: integer({ mode: 'timestamp' }),
    refreshTokenExpiresAt: integer({ mode: 'timestamp' }),
    scope: text(),
    password: text(),
    createdAt: integer({ mode: 'timestamp' }).notNull(),
    updatedAt: integer({ mode: 'timestamp' }).notNull()
})

export const invitation = sqliteTable('invitation', {
    id: text().primaryKey().notNull(),
    organizationId: text()
        .notNull()
        .references(() => organization.id, { onDelete: 'cascade' }),
    email: text().notNull(),
    role: text(),
    status: text().default('pending').notNull(),
    expiresAt: integer({ mode: 'timestamp' }).notNull(),
    inviterId: text()
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: integer({ mode: 'timestamp' })
})

export const member = sqliteTable('member', {
    id: text().primaryKey().notNull(),
    organizationId: text()
        .notNull()
        .references(() => organization.id, { onDelete: 'cascade' }),
    userId: text()
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    role: text().$type<MemberRole>().default('member').notNull(),
    createdAt: integer({ mode: 'timestamp' }),
    updatedAt: integer({ mode: 'timestamp' })
})

export const organization = sqliteTable('organization', {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    slug: text().unique(),
    logo: text(),
    plan: text().$type<OrganizationPlan>().default('free').notNull(),
    createdAt: integer({ mode: 'timestamp' }),
    updatedAt: integer({ mode: 'timestamp' }),
    metadata: text()
})

export const session = sqliteTable('session', {
    id: text().primaryKey().notNull(),
    expiresAt: integer({ mode: 'timestamp' }).notNull(),
    token: text().notNull().unique(),
    createdAt: integer({ mode: 'timestamp' }).notNull(),
    updatedAt: integer({ mode: 'timestamp' }).notNull(),
    ipAddress: text(),
    userAgent: text(),
    userId: text()
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    activeOrganizationId: text()
})

export const user = sqliteTable('user', {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    email: text().notNull().unique(),
    emailVerified: integer({ mode: 'boolean' }).notNull(),
    image: text(),
    createdAt: integer({ mode: 'timestamp' }).notNull(),
    updatedAt: integer({ mode: 'timestamp' }).notNull()
})

export const verification = sqliteTable('verification', {
    id: text().primaryKey().notNull(),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: integer({ mode: 'timestamp' }).notNull(),
    createdAt: integer({ mode: 'timestamp' }),
    updatedAt: integer({ mode: 'timestamp' })
})

export const apiKey = sqliteTable('apiKey', {
    id: text().primaryKey().notNull(),
    name: text(),
    start: text(),
    prefix: text(),
    key: text().notNull(),
    userId: text()
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    refillInterval: integer(),
    refillAmount: integer(),
    lastRefillAt: integer({ mode: 'timestamp' }),
    enabled: integer({ mode: 'boolean' }).default(true).notNull(),
    rateLimitEnabled: integer({ mode: 'boolean' }).default(true).notNull(),
    rateLimitTimeWindow: integer(),
    rateLimitMax: integer(),
    requestCount: integer().default(0).notNull(),
    remaining: integer(),
    lastRequest: integer({ mode: 'timestamp' }),
    expiresAt: integer({ mode: 'timestamp' }),
    createdAt: integer({ mode: 'timestamp' }).notNull(),
    updatedAt: integer({ mode: 'timestamp' }).notNull(),
    permissions: text(),
    metadata: text()
})
