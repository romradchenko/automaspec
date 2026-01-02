import type { ContractRouterClient } from '@orpc/contract'

import { createORPCClient, createSafeClient } from '@orpc/client'
import { RequestValidationPlugin, ResponseValidationPlugin } from '@orpc/contract/plugins'
import { OpenAPILink } from '@orpc/openapi-client/fetch'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'

import { contract } from '@/orpc/contracts'

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

        // Next Docs recommend that approach, so dynamic imports should be here 100%
        const { headers } = await import('next/headers')
        return await headers()
    },
    fetch: async (request, init) =>
        globalThis.fetch(request, {
            ...init,
            credentials: 'include'
        }),
    plugins: [new RequestValidationPlugin(contract), new ResponseValidationPlugin(contract)]
})

const client: ContractRouterClient<typeof contract> = globalThis.$client ?? createORPCClient(link)
export const safeClient = createSafeClient(client)
export const orpc = createTanstackQueryUtils(client)
