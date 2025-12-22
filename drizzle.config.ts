import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    schema: './db/schema',
    out: './db/migrations',
    dialect: 'turso',
    casing: 'snake_case',
    dbCredentials: {
        // NEXT_PUBLIC prefix is needed for client-side orpc client
        url: process.env.NODE_ENV === 'development' ? 'file:db/local.db' : (process.env.NEXT_PUBLIC_DATABASE_URL ?? ''),
        authToken: process.env.DATABASE_AUTH_TOKEN
    }
})
