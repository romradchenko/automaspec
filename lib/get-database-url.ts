export function getDatabaseUrl() {
    if (process.env.NODE_ENV === 'test') {
        return process.env.E2E_DATABASE_URL ?? 'file:/tmp/automaspec-playwright-db/e2e.db'
    }

    if (process.env.NODE_ENV === 'development') {
        return process.env.NEXT_PUBLIC_DATABASE_LOCAL_URL ?? 'file:db/local.db'
    }

    return process.env.NEXT_PUBLIC_DATABASE_URL ?? ''
}
