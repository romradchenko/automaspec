import { relations } from 'drizzle-orm/relations'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

import { OrganizationPlan } from '@/lib/types'

import { testFolder, testSpec } from './tests'

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
    role: text().default('member').notNull(),
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

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id]
    })
}))

export const userRelations = relations(user, ({ many }) => ({
    accounts: many(account),
    invitations: many(invitation),
    members: many(member),
    sessions: many(session)
}))

export const invitationRelations = relations(invitation, ({ one }) => ({
    user: one(user, {
        fields: [invitation.inviterId],
        references: [user.id]
    }),
    organization: one(organization, {
        fields: [invitation.organizationId],
        references: [organization.id]
    })
}))

export const organizationRelations = relations(organization, ({ many }) => ({
    invitations: many(invitation),
    members: many(member),
    testFolders: many(testFolder),
    testSpecs: many(testSpec)
}))

export const memberRelations = relations(member, ({ one }) => ({
    user: one(user, {
        fields: [member.userId],
        references: [user.id]
    }),
    organization: one(organization, {
        fields: [member.organizationId],
        references: [organization.id]
    })
}))

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id]
    })
}))
