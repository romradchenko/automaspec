import { createClient } from '@libsql/client/web'
import { drizzle } from 'drizzle-orm/libsql/web'

const client = createClient({
    // NEXT_PUBLIC prefix is needed for client-side orpc client
    url: process.env.NEXT_PUBLIC_DATABASE_URL ?? '',
    authToken: process.env.DATABASE_AUTH_TOKEN
})

export const db = drizzle(client, { casing: 'snake_case' })
