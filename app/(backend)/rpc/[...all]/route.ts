import { LoggingHandlerPlugin } from '@orpc/experimental-pino'
import { SmartCoercionPlugin } from '@orpc/json-schema'
import { OpenAPIHandler } from '@orpc/openapi/fetch'
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins'
import { onError } from '@orpc/server'
import { CORSPlugin } from '@orpc/server/plugins'
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4'
import { NextResponse } from 'next/server'

import type { RpcError } from '@/lib/types'

import { createContext } from '@/lib/orpc/context'
import { createServerLogger } from '@/lib/server-logger'
import { router } from '@/orpc/routes'

const logger = createServerLogger()

function getErrorCause(error: unknown): RpcError['cause'] | undefined {
    if (typeof error !== 'object' || error === null) {
        return undefined
    }
    const withCause = error as Partial<RpcError>
    if (!withCause.cause || typeof withCause.cause !== 'object') {
        return undefined
    }
    return withCause.cause
}

const handler = new OpenAPIHandler(router, {
    plugins: [
        new CORSPlugin({
            exposeHeaders: ['Content-Disposition']
        }),
        new SmartCoercionPlugin({
            schemaConverters: [new ZodToJsonSchemaConverter()]
        }),
        new LoggingHandlerPlugin({
            logger,
            generateId: () => crypto.randomUUID(),
            logRequestResponse: true,
            logRequestAbort: true
        }),
        new OpenAPIReferencePlugin({
            docsPath: '/docs',
            specPath: '/spec',
            schemaConverters: [new ZodToJsonSchemaConverter()],
            specGenerateOptions: {
                info: {
                    title: 'Automaspec API',
                    version: '1.0.0'
                }
            }
        })
    ],
    interceptors: [
        onError((error) => {
            const cause = getErrorCause(error)
            logger.error(
                {
                    err: error,
                    validationIssues: cause?.issues,
                    validationData: cause?.data
                },
                'RPC Error'
            )
        })
    ]
})

async function handleRequest(request: Request) {
    const context = await createContext(request)
    if (!context.session) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    const { response } = await handler.handle(request, {
        prefix: '/rpc',
        context: {
            session: context.session
        }
    })

    return response ?? new Response('Not found', { status: 404 })
}

export const HEAD = handleRequest
export const GET = handleRequest
export const POST = handleRequest
export const PUT = handleRequest
export const PATCH = handleRequest
export const DELETE = handleRequest
