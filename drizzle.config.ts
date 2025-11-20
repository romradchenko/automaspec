import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    schema: './db/schema',
    out: './db/migrations',
    dialect: 'turso',
    casing: 'snake_case',
    dbCredentials: {
        url: process.env.NEXT_PUBLIC_DATABASE_URL ?? '',
        authToken: process.env.DATABASE_AUTH_TOKEN
    }
})
