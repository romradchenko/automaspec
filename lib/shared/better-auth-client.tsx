import { apiKeyClient, inferOrgAdditionalFields, organizationClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

import type { auth } from './better-auth'

export const authClient = createAuthClient({
    baseURL: typeof window !== 'undefined' ? window.location.origin : undefined,
    fetchOptions: {
        onError: async (context) => {
            const { response } = context
            if (response.status === 429) {
                const retryAfter = response.headers.get('X-Retry-After')
                console.log(`Rate limit exceeded. Retry after ${retryAfter} seconds`)
            }
        }
    },
    plugins: [
        apiKeyClient(),
        organizationClient({
            schema: inferOrgAdditionalFields<typeof auth>()
        })
    ]
})
