import { loadEnvConfig } from '@next/env'
import { defineConfig } from '@playwright/test'
import os from 'node:os'
import path from 'node:path'

const projectDir = process.cwd()
loadEnvConfig(projectDir)

const hostname = process.env.E2E_HOSTNAME
const port = process.env.E2E_PORT
const baseURL = `http://${hostname}:${port}`

if (!hostname || !port) {
    throw new Error('E2E_HOSTNAME and E2E_PORT must be set')
}

export default defineConfig({
    testDir: path.join(__dirname, 'e2e'),
    fullyParallel: false,
    workers: 1,
    timeout: 120 * 1000,
    use: {
        baseURL,
        headless: true,
        viewport: { width: 1280, height: 720 },
        trace: 'retain-on-failure',
        video: 'retain-on-failure',
        screenshot: 'only-on-failure'
    },
    outputDir: path.join(os.tmpdir(), 'automaspec-playwright'),
    webServer: {
        command: `pnpm exec next dev --webpack --hostname ${hostname} --port ${port}`,
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120 * 1000,
        env: {
            NEXT_PUBLIC_E2E_MOCK: 'true'
        }
    }
})
