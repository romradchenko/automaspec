import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql/web'

const client = createClient({
    // NEXT_PUBLIC prefix is needed for client-side orpc client
    url: process.env.NODE_ENV === 'development' ? 'file:db/local.db' : (process.env.NEXT_PUBLIC_DATABASE_URL ?? ''),
    authToken: process.env.DATABASE_AUTH_TOKEN
})

export const db = drizzle(client, { casing: 'snake_case' })
