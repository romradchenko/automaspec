import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { user, member, organization } from '@/db/schema/auth'
import { accountContract } from '@/orpc/contracts/account'
import { authMiddleware } from '@/orpc/middleware'
import { implement } from '@orpc/server'

const os = implement(accountContract).use(authMiddleware)

const exportAccount = os.account.export.handler(async ({ context }) => {
    const u = await db
        .select({ id: user.id, name: user.name, email: user.email, image: user.image, createdAt: user.createdAt })
        .from(user)
        .where(eq(user.id, context.session.user.id))
        .limit(1)

    const rawMemberships = await db
        .select({ organizationId: member.organizationId, role: member.role, organizationName: organization.name })
        .from(member)
        .leftJoin(organization, eq(member.organizationId, organization.id))
        .where(eq(member.userId, context.session.user.id))

    return {
        user: {
            id: u[0]?.id ?? context.session.user.id,
            name: u[0]?.name ?? context.session.user.name ?? '',
            email: u[0]?.email ?? context.session.user.email ?? '',
            image: u[0]?.image ?? context.session.user.image ?? null,
            createdAt: new Date(u[0]?.createdAt ?? context.session.user.createdAt ?? Date.now()).toISOString()
        },
        memberships: rawMemberships.map((m) => ({
            organizationId: m.organizationId,
            organizationName: m.organizationName ?? '',
            role: m.role ?? null
        }))
    }
})

const deleteAccount = os.account.delete.handler(async ({ context }) => {
    await db.delete(user).where(eq(user.id, context.session.user.id))
    return { success: true }
})

export const accountRouter = os.router({ account: { export: exportAccount, delete: deleteAccount } })
