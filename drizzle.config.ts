import { defineConfig } from 'drizzle-kit'

import { getDatabaseUrl } from './lib/get-database-url'

export default defineConfig({
    schema: './db/schema',
    out: './db/migrations',
    dialect: 'turso',
    casing: 'snake_case',
    dbCredentials: {
        url: getDatabaseUrl(),
        authToken: process.env.DATABASE_AUTH_TOKEN
    }
})
