import { expect, test } from '@playwright/test'

import { attachPageLogs, ensureDashboard } from './helpers'
import { seedE2eDatabase } from './seed-db'

test.beforeAll(async () => {
    await seedE2eDatabase()
})

test.beforeEach(async ({ page }) => {
    await attachPageLogs(page)
    await ensureDashboard(page)
})

test('dashboard tree loads and shows spec details', async ({ page }) => {
    const dashboardFolder = page.getByRole('treeitem', { name: 'Dashboard Tests' })
    await expect(dashboardFolder).toBeVisible()
    await dashboardFolder.click()
    await page.keyboard.press('ArrowRight')

    const dashboardSpec = page.getByRole('treeitem', { name: 'Dashboard Tree View' })
    await dashboardSpec.click()
    await expect(dashboardSpec).toBeVisible()

    await expect(page.getByText('Functional Requirements', { exact: true })).toBeVisible()
    await expect(page.getByText('Display folders in tree', { exact: true })).toBeVisible()
    await expect(page.getByText('Select spec shows details', { exact: true })).toBeVisible()
})

test('analytics view renders mock metrics', async ({ page }) => {
    await page.goto('/analytics', { waitUntil: 'domcontentloaded' })
    await expect(page.getByText('Analytics Dashboard', { exact: true })).toBeVisible()
    await expect(page.getByText('Tests Growth', { exact: true })).toBeVisible()
    await expect(page.getByText('Stale Tests', { exact: true })).toBeVisible()
})
