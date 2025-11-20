import { inferOrgAdditionalFields, organizationClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

import type { auth } from './better-auth'

export const authClient = createAuthClient({
    baseURL: typeof window !== 'undefined' ? window.location.origin : undefined,
    plugins: [
        organizationClient({
            schema: inferOrgAdditionalFields<typeof auth>()
        })
    ]
})
