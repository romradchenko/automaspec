import { OpenAPILink } from '@orpc/openapi-client/fetch'
import { contract } from '@/orpc/contracts'
import { createORPCClient, onError, createSafeClient } from '@orpc/client'
import type { ContractRouterClient } from '@orpc/contract'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { ResponseValidationPlugin } from '@orpc/contract/plugins'

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
    interceptors: [
        onError((error: any) => {
            console.error('Client RPC Error:', error)
            if (error.cause && error.cause.issues) {
                console.error('Client Validation Issues:', JSON.stringify(error.cause.issues, null, 2))
            }
            if (error.cause && error.cause.data) {
                console.error('Client Data that failed validation:', JSON.stringify(error.cause.data, null, 2))
            }
        })
    ],
    plugins: [new ResponseValidationPlugin(contract)]
})

/**
 * Fallback to client-side client if server-side client is not available.
 */
export const client: ContractRouterClient<typeof contract> = globalThis.$client ?? createORPCClient(link)
export const safeClient = createSafeClient(client)

export const orpc = createTanstackQueryUtils(client)
