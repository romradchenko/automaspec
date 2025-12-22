import { expect, test } from '@playwright/test'

import { attachPageLogs, ensureDashboard } from './helpers'

test.beforeEach(async ({ page }) => {
    await attachPageLogs(page)
})

test('user signs in and activates organization', async ({ page }) => {
    await ensureDashboard(page)
    await expect(page.getByText('Automaspec Org')).toBeVisible({ timeout: 30_000 })
    await expect(page.getByText('Free Plan')).toBeVisible({ timeout: 30_000 })
})
