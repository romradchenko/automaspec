import type { ContractRouterClient } from '@orpc/contract'

import { contract } from '@/orpc/contracts'
import { createORPCClient, createSafeClient } from '@orpc/client'
import { RequestValidationPlugin, ResponseValidationPlugin } from '@orpc/contract/plugins'
import { OpenAPILink } from '@orpc/openapi-client/fetch'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'

declare global {
    var $client: ContractRouterClient<typeof contract> | undefined
}

const link = new OpenAPILink(contract, {
    url: () => {
        if (typeof window === 'undefined') {
            throw new Error('OpenAPILink is not allowed on the server side.')
        }

        return `${window.location.origin}/rpc`
    },
    headers: async () => {
        if (typeof window !== 'undefined') {
            return {}
        }

        const { headers } = await import('next/headers')
        return await headers()
    },
    fetch: (request, init) =>
        globalThis.fetch(request, {
            ...init,
            credentials: 'include'
        }),
    plugins: [new RequestValidationPlugin(contract), new ResponseValidationPlugin(contract)]
})

/**
 * Fallback to client-side client if server-side client is not available.
 */
const client: ContractRouterClient<typeof contract> = globalThis.$client ?? createORPCClient(link)
export const safeClient = createSafeClient(client)

export const orpc = createTanstackQueryUtils(client)
