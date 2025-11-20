import { drizzle } from 'drizzle-orm/libsql'

export const db = drizzle({
    connection: {
        url: process.env.NEXT_PUBLIC_DATABASE_URL ?? '',
        authToken: process.env.DATABASE_AUTH_TOKEN
    },
    casing: 'snake_case'
})
