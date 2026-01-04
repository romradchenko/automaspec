import { expect, test } from './fixtures'
import { attachPageLogs, ensureDashboard, waitForAppReady } from './helpers'
import { seedE2eDatabase } from './seed-db'

test.beforeAll(async () => {
    await seedE2eDatabase()
})

test.beforeEach(async ({ page }) => {
    await attachPageLogs(page)
})

test('dashboard tree loads and shows spec details', async ({ page }) => {
    await ensureDashboard(page)
    await expect(page.getByRole('treeitem', { name: 'Dashboard Tests' })).toBeVisible()

    const dashboardFolder = page.getByRole('treeitem', { name: 'Dashboard Tests' })
    const dashboardFolderHeading = page.getByRole('heading', { name: 'Dashboard Tests' })

    for (let i = 0; i < 3; i++) {
        await dashboardFolder.click()
        try {
            await dashboardFolderHeading.waitFor({ state: 'visible', timeout: 10_000 })
            break
        } catch {
            continue
        }
    }

    await expect(dashboardFolderHeading).toBeVisible({ timeout: 30_000 })

    const dashboardSpec = page.getByRole('button', { name: /Dashboard Tree View.*dashboard-tree\.spec\.ts/ })
    await expect(dashboardSpec).toBeVisible({ timeout: 30_000 })
    await dashboardSpec.click()

    await expect(page.getByText('Functional Requirements')).toBeVisible({ timeout: 30_000 })
    await expect(page.getByText('Display folders in tree')).toBeVisible({ timeout: 30_000 })
    await expect(page.getByText('Select spec shows details')).toBeVisible({ timeout: 30_000 })
})

test('analytics view renders mock metrics', async ({ page }) => {
    await ensureDashboard(page)
    await page.goto('/analytics', { waitUntil: 'domcontentloaded' })
    await waitForAppReady(page)
    await expect(page.getByText('Analytics Dashboard')).toBeVisible({ timeout: 30_000 })
    await expect(page.getByText('Tests Growth')).toBeVisible({ timeout: 30_000 })
    await expect(page.getByText('Stale Tests', { exact: true })).toBeVisible({ timeout: 30_000 })
})
