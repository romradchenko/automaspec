import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { organizationClient, inferOrgAdditionalFields } from 'better-auth/client/plugins'
import { nextCookies } from 'better-auth/next-js'
import { organization } from 'better-auth/plugins/organization'
import { createAuthClient } from 'better-auth/react'

import { db } from '@/db'
import * as schema from '@/db/schema'

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'sqlite',
        schema: schema
    }),
    trustedOrigins: process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : [],
    emailAndPassword: {
        enabled: true
    },
    plugins: [
        organization({
            allowUserToCreateOrganization: true,
            organizationLimit: 1,
            membershipLimit: 1,
            creatorRole: 'owner'
        }),
        nextCookies()
    ]
})

export const authClient = createAuthClient({
    baseURL: typeof window !== 'undefined' ? window.location.origin : undefined,
    plugins: [
        organizationClient({
            schema: inferOrgAdditionalFields<typeof auth>()
        })
    ]
})
