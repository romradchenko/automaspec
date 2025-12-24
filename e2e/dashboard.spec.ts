import { expect, test } from '@playwright/test'

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
    await dashboardFolder.click()
    await page.keyboard.press('ArrowRight')

    const dashboardSpec = page.getByRole('treeitem', { name: 'Dashboard Tree View' })
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
