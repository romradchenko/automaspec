import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql/web'

import { getDatabaseUrl } from '@/lib/get-database-url'

const client = createClient({
    url: getDatabaseUrl(),
    authToken: process.env.DATABASE_AUTH_TOKEN
})

export const db = drizzle(client, { casing: 'snake_case' })
