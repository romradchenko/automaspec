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

export async function ensureDashboard(page: Page) {
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' })

    if (page.url().includes('/dashboard')) {
        return
    }

    if (page.url().includes('/choose-organization')) {
        const activateButtons = page.getByRole('button', { name: 'Set as active' })
        await expect(activateButtons.first()).toBeVisible()
        await activateButtons.first().click()
        await page.waitForURL('**/dashboard', { waitUntil: 'load' })
        return
    }

    await page.goto('/login', { waitUntil: 'domcontentloaded' })
    const dashboardLink = page.getByRole('link', { name: 'Go to dashboard' })
    if (await dashboardLink.isVisible()) {
        await dashboardLink.click()
        await page.waitForURL(/(choose-organization|dashboard|create-organization)/, {
            waitUntil: 'load',
            timeout: 30_000
        })
    } else {
        await page.fill('input[name="email"]', 'demo@automaspec.com')
        await page.fill('input[name="password"]', 'demo1234')
        await page.getByRole('button', { name: 'Sign in' }).click()
        await page.waitForURL(/(choose-organization|dashboard|create-organization)/, {
            waitUntil: 'load',
            timeout: 30_000
        })
    }

    if (page.url().includes('/create-organization')) {
        await page.waitForSelector('text=Create Your Organization', { timeout: 15_000 })
        // oxlint-disable-next-line no-empty-function
        await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {})

        const chooseOrgButton = page.locator('button').filter({ hasText: /Choose organization|View all organizations/ })
        const isVisible = await chooseOrgButton.isVisible({ timeout: 10_000 }).catch(() => false)

        if (isVisible) {
            await chooseOrgButton.click()
            await page.waitForURL(/(choose-organization|dashboard)/, { waitUntil: 'load', timeout: 30_000 })
        } else {
            await page.goto('/choose-organization', { waitUntil: 'domcontentloaded', timeout: 30_000 })
        }
    }

    if (page.url().includes('choose-organization')) {
        const activateButtons = page.getByRole('button', { name: 'Set as active' })
        await expect(activateButtons.first()).toBeVisible()
        await activateButtons.first().click()
        await page.waitForURL('**/dashboard', { waitUntil: 'load' })
    }
}
