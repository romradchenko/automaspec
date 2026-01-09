import { loadEnvConfig } from '@next/env'
import { defineConfig } from '@playwright/test'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const projectDir = process.cwd()
loadEnvConfig(projectDir)

const hostname = process.env.E2E_HOSTNAME
const port = process.env.E2E_PORT
const baseURL = `http://${hostname}:${port}`
const localDbUrl = process.env.NEXT_PUBLIC_DATABASE_LOCAL_URL

if (!hostname || !port) {
    throw new Error('E2E_HOSTNAME and E2E_PORT must be set')
}
if (!localDbUrl) {
    throw new Error('NEXT_PUBLIC_DATABASE_LOCAL_URL must be set')
}
if (!localDbUrl.startsWith('file:')) {
    throw new Error('NEXT_PUBLIC_DATABASE_LOCAL_URL must start with file:')
}

const localDbPath = localDbUrl.replace('file:', '').replaceAll('/', path.sep)
const resolvedLocalDbPath = path.isAbsolute(localDbPath) ? localDbPath : path.resolve(projectDir, localDbPath)

const e2eDbPath = path.join(os.tmpdir(), 'automaspec-playwright-db', 'e2e.db')
fs.mkdirSync(path.dirname(e2eDbPath), { recursive: true })
fs.copyFileSync(resolvedLocalDbPath, e2eDbPath)

const e2eDbUrl = `file:${e2eDbPath.replaceAll('\\', '/')}`
process.env.E2E_DATABASE_URL = e2eDbUrl

export default defineConfig({
    testDir: path.join(__dirname, 'e2e'),
    fullyParallel: false,
    workers: 1,
    timeout: 25 * 1000,
    retries: 2,
    use: {
        baseURL,
        headless: true,
        viewport: { width: 1920, height: 1080 },
        trace: 'retain-on-failure',
        video: 'retain-on-failure',
        screenshot: 'only-on-failure'
    },
    reporter: [['html', { open: 'never' }], ['json', { outputFile: 'test-results.json' }], ['list']],
    outputDir: path.join(__dirname, 'test-results'),
    webServer: {
        command: `pnpm dev --hostname ${hostname} --port ${port}`,
        url: baseURL,
        reuseExistingServer: false,
        timeout: 120 * 1000,
        env: {
            NODE_ENV: 'test',
            E2E_DATABASE_URL: e2eDbUrl,
            NEXT_PUBLIC_DATABASE_URL: e2eDbUrl,
            NEXT_PUBLIC_DATABASE_LOCAL_URL: e2eDbUrl
        }
    }
})
