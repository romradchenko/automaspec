import * as z from 'zod'

import { memberSelectSchema } from '@/lib/types'
import { oc } from '@orpc/contract'

const exportDataOutput = z.object({
    user: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        image: z.string().nullish(),
        createdAt: z.string()
    }),
    memberships: z.array(
        z.object({
            organizationId: z.string(),
            organizationName: z.string(),
            role: z.enum(['owner', 'admin', 'member']).nullable()
        })
    )
})

const exportAccountContract = oc
    .route({ method: 'GET', path: '/account/{userId}/export', tags: ['account'], description: 'Export account data' })
    .input(memberSelectSchema.pick({ userId: true }))
    .output(exportDataOutput)

const deleteAccountContract = oc
    .route({ method: 'DELETE', path: '/account/{userId}/delete', tags: ['account'], description: 'Delete account' })
    .input(memberSelectSchema.pick({ userId: true }))
    .output(z.object({ success: z.boolean() }))

export const accountContract = {
    account: {
        export: exportAccountContract,
        delete: deleteAccountContract
    }
}
