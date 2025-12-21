import 'server-only'
import { createRouterClient } from '@orpc/server'
import { headers } from 'next/headers'

import { router } from '@/orpc/routes'

globalThis.$client = createRouterClient(router, {
    context: async () => ({
        headers: await headers()
    })
})
