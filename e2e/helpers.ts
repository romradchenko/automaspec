import { expect, type Page } from '@playwright/test'

export async function attachPageLogs(page: Page) {
    page.on('console', (message) => {
        console.debug(`[browser:${message.type()}] ${message.text()}`)
    })
    page.on('pageerror', (error) => {
        console.debug(`[pageerror] ${error.message}`)
        if (error.stack) {
            console.error(error.stack)
        }
    })
    page.on('requestfailed', (request) => {
        const failure = request.failure()
        const failureText = failure?.errorText ?? 'unknown'
        console.debug(`[requestfailed] ${request.method()} ${request.url()} ${failureText}`)
    })
    page.on('response', async (response) => {
        const request = response.request()
        if (request.resourceType() !== 'script') {
            return
        }
        const headers = response.headers()
        const contentType = headers['content-type'] ?? ''
        if (response.status() === 200 && contentType.includes('javascript')) {
            return
        }
        const bodyText = await response.text()
        const preview = bodyText.slice(0, 200).replaceAll('\n', ' ').replaceAll('\r', ' ')
        console.debug(`[script] ${response.status()} ${contentType} ${request.url()} :: ${preview}`)
    })
}

export async function waitForAppReady(page: Page) {
    const compilingIndicator = page.getByText('Compiling')
    if (await compilingIndicator.isVisible()) {
        await compilingIndicator.waitFor({ state: 'hidden', timeout: 60_000 })
    }
}

export async function ensureDashboard(page: Page) {
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' })

    if (page.url().includes('/dashboard')) {
        await waitForAppReady(page)
        return
    }

    if (page.url().includes('/choose-organization')) {
        const activateButtons = page.getByRole('button', { name: 'Set as active' })
        await expect(activateButtons.first()).toBeVisible()
        await activateButtons.first().click()
        await page.waitForURL('**/dashboard', { waitUntil: 'commit' })
        await waitForAppReady(page)
        return
    }

    if (page.url().includes('/login')) {
        throw new Error('E2E auth state missing/invalid. Run `pnpm auth:ensure` and rerun tests.')
    }

    throw new Error(`Unexpected redirect while opening /dashboard: ${page.url()}`)
}
