import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { apiKey } from 'better-auth/plugins'
import { organization } from 'better-auth/plugins/organization'

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
        apiKey({
            defaultPrefix: 'ams_'
        }),
        organization({
            allowUserToCreateOrganization: true,
            organizationLimit: 2,
            membershipLimit: 1,
            creatorRole: 'owner',
            schema: {
                organization: {
                    additionalFields: {
                        plan: {
                            type: 'string',
                            input: true,
                            required: false
                        }
                    }
                }
            }
        }),
        nextCookies()
    ]
})
