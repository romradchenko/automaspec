import { loadEnvConfig } from '@next/env'
import { defineAuthConfig } from '@playwright-kit/auth'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

function getRequiredEnv(name: string) {
    const value = process.env[name]
    if (!value) {
        throw new Error(`${name} must be set`)
    }
    return value
}

const projectDir = process.cwd()
loadEnvConfig(projectDir)

const hostname = getRequiredEnv('E2E_HOSTNAME')
const port = getRequiredEnv('E2E_PORT')
const baseURL = `http://${hostname}:${port}`

const localDbUrl = getRequiredEnv('NEXT_PUBLIC_DATABASE_LOCAL_URL')
if (!localDbUrl.startsWith('file:')) {
    throw new Error('NEXT_PUBLIC_DATABASE_LOCAL_URL must start with file:')
}

const localDbPath = localDbUrl.replace('file:', '').replaceAll('/', path.sep)
const resolvedLocalDbPath = path.isAbsolute(localDbPath) ? localDbPath : path.resolve(projectDir, localDbPath)

const e2eDbPath = path.join(os.tmpdir(), 'automaspec-playwright-db', 'e2e.db')
fs.mkdirSync(path.dirname(e2eDbPath), { recursive: true })
fs.copyFileSync(resolvedLocalDbPath, e2eDbPath)

const e2eDbUrl = `file:${e2eDbPath.replaceAll('\\', '/')}`

export default defineAuthConfig({
    baseURL,
    statesDir: path.join(projectDir, '.playwright', 'auth'),
    webServer: {
        command: `node ${path.join(projectDir, 'node_modules', 'next', 'dist', 'bin', 'next')} dev --webpack --hostname ${hostname} --port ${port}`,
        url: `${baseURL}/login`,
        timeoutMs: 120_000,
        reuseExisting: true,
        env: {
            E2E_DATABASE_URL: e2eDbUrl,
            NEXT_PUBLIC_DATABASE_URL: e2eDbUrl,
            NEXT_PUBLIC_DATABASE_LOCAL_URL: e2eDbUrl
        }
    },
    profiles: {
        demo: {
            validateUrl: '/login',
            async login(page, { credentials }) {
                await page.goto('/login')
                const signedInBanner = page.getByText('You are already signed in as')
                try {
                    await signedInBanner.waitFor({ state: 'visible', timeout: 5_000 })

                    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' })
                    if (page.url().includes('/choose-organization')) {
                        const activateButtons = page.getByRole('button', { name: 'Set as active' })
                        await activateButtons.first().waitFor({ state: 'visible', timeout: 30_000 })
                        await activateButtons.first().click()
                        await page.waitForURL(/\/dashboard/, { waitUntil: 'commit', timeout: 30_000 })
                    }
                    return
                } catch {
                    await page.locator('input[name="email"]').fill(credentials.email)
                    await page.locator('input[name="password"]').fill(credentials.password)
                    await page.getByRole('button', { name: 'Sign in' }).click()
                    await page.waitForURL(/(choose-organization|create-organization|dashboard)/, {
                        waitUntil: 'commit'
                    })

                    if (page.url().includes('/choose-organization')) {
                        const activateButtons = page.getByRole('button', { name: 'Set as active' })
                        await activateButtons.first().waitFor({ state: 'visible', timeout: 30_000 })
                        await activateButtons.first().click()
                        await page.waitForURL(/\/dashboard/, { waitUntil: 'commit', timeout: 30_000 })
                        return
                    }

                    if (page.url().includes('/create-organization')) {
                        throw new Error('No organizations available for demo user')
                    }
                }
            },
            async validate(page) {
                try {
                    await page.goto('/login', { waitUntil: 'domcontentloaded' })
                    const signedInBanner = page.getByText('You are already signed in as')
                    await signedInBanner.waitFor({ state: 'visible', timeout: 10_000 })
                } catch {
                    return { ok: false, reason: 'Not signed in' }
                }

                try {
                    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' })
                    await page.waitForURL(/\/choose-organization/, { waitUntil: 'commit', timeout: 5_000 })
                    return { ok: false, reason: 'User has no active organization' }
                } catch {
                    return { ok: true }
                }
            }
        }
    }
})
