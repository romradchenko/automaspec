import { expect, test } from '@playwright/test'

import { attachPageLogs, ensureDashboard } from './helpers'
import { seedE2eDatabase } from './seed-db'

test.beforeAll(async () => {
    await seedE2eDatabase()
})

test.beforeEach(async ({ page }) => {
    await attachPageLogs(page)
    await page.waitForTimeout(10000)
    await ensureDashboard(page)
})

test('requirements replace supports add and delete', async ({ page }) => {
    await expect(page.getByRole('treeitem', { name: 'Dashboard Tests' })).toBeVisible()

    const dashboardFolder = page.getByRole('treeitem', { name: 'Dashboard Tests' })
    await dashboardFolder.click()
    await page.keyboard.press('ArrowRight')

    const dashboardSpec = page.getByRole('treeitem', { name: 'Dashboard Tree View' })
    await expect(dashboardSpec).toBeVisible()
    await dashboardSpec.click()

    await expect(page.getByText('Functional Requirements', { exact: true })).toBeVisible()

    const requirementName = 'E2E adds requirement 2'

    await page.getByRole('button', { name: 'Edit' }).click()
    await page.getByRole('button', { name: 'Add Requirement' }).click()
    await page.getByPlaceholder('Enter requirement name...').last().fill(requirementName)
    await page.getByRole('button', { name: 'Save Changes' }).click()

    await expect(page.getByText(requirementName, { exact: true })).toBeVisible()

    await expect(page.getByRole('treeitem', { name: 'Dashboard Tests' })).toBeVisible()
    await page.getByRole('treeitem', { name: 'Dashboard Tests' }).click()
    await page.keyboard.press('ArrowRight')
    await page.getByRole('treeitem', { name: 'Dashboard Tree View' }).click()

    await expect(page.getByText(requirementName, { exact: true })).toBeVisible()

    await page.getByRole('button', { name: 'Edit' }).click()
    const lastRequirementInput = page.getByPlaceholder('Enter requirement name...').last()
    await expect(lastRequirementInput).toHaveValue(requirementName)
    await lastRequirementInput.locator('..').getByRole('button').click()
    await page.getByRole('button', { name: 'Save Changes' }).click()

    await expect(page.getByText(requirementName)).toHaveCount(0)

    await page.getByRole('treeitem', { name: 'Dashboard Tests' }).click()
    await page.keyboard.press('ArrowRight')
    await page.getByRole('treeitem', { name: 'Dashboard Tree View' }).click()

    await expect(page.getByText(requirementName)).toHaveCount(0)
})
