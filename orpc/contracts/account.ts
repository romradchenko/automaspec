import * as z from 'zod'

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
        z.object({ organizationId: z.string(), organizationName: z.string(), role: z.string().nullable() })
    )
})

const exportAccountContract = oc.route({ method: 'GET', path: '/account/export' }).output(exportDataOutput)

const deleteAccountContract = oc
    .route({ method: 'DELETE', path: '/account' })
    .output(z.object({ success: z.boolean() }))

export const accountContract = {
    account: {
        export: exportAccountContract,
        delete: deleteAccountContract
    }
}
