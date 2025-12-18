import { NextResponse } from 'next/server'
import pino from 'pino'
import pretty from 'pino-pretty'

import { createContext } from '@/lib/orpc/context'
import { router } from '@/orpc/routes'
import { LoggingHandlerPlugin } from '@orpc/experimental-pino'
import { SmartCoercionPlugin } from '@orpc/json-schema'
import { OpenAPIHandler } from '@orpc/openapi/fetch'
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins'
import { onError } from '@orpc/server'
import { CORSPlugin } from '@orpc/server/plugins'
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4'

const logger = pino(pretty({ colorize: true, singleLine: true }))

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
            generateId: () => crypto.randomUUID(), // Custom ID generator
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
        // oxlint-disable-next-line no-explicit-any
        onError((error: any) => {
            console.error('RPC Error:', error)
            if (error.cause && error.cause.issues) {
                console.error('Validation Issues:', JSON.stringify(error.cause.issues, null, 2))
            }
            if (error.cause && error.cause.data) {
                console.error('Data that failed validation:', JSON.stringify(error.cause.data, null, 2))
            }
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
