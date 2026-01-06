import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const BASE_URL = 'https://automaspec.vercel.app'
const OUTPUT_DIR = path.join(process.cwd(), 'docs_requirments', 'screenshots-prod')
const DEMO_EMAIL = 'demo@automaspec.com'
const DEMO_PASSWORD = 'demo1234'

const VIEWPORTS = [
    { name: 'desktop', width: 1920, height: 1080 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 375, height: 667 }
]

const PAGES = [
    { name: 'home', path: '/' },
    { name: 'login', path: '/login' },
    { name: 'choose-organization', path: '/choose-organization' },
    { name: 'dashboard', path: '/dashboard' },
    { name: 'folder-view', path: '/dashboard' },
    { name: 'analytics', path: '/analytics' },
    { name: 'rpc-docs', path: '/rpc/docs' },
    { name: 'rpc-spec', path: '/rpc/spec' },
    { name: 'health', path: '/api/health' }
]

async function ensureDir() {
    await mkdir(OUTPUT_DIR, { recursive: true })
}

async function writeIndex(lines) {
    const indexPath = path.join(OUTPUT_DIR, 'README.md')
    await writeFile(indexPath, lines.join('\n') + '\n', 'utf8')
}

async function login(page) {
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForTimeout(500)

    await page.fill('input[type="email"]', DEMO_EMAIL)
    await page.fill('input[type="password"]', DEMO_PASSWORD)
    await page.click('button[type="submit"]')

    await page.waitForURL(/\/(choose-organization|dashboard)/, { timeout: 30000 })
    await page.waitForTimeout(1000)
}

async function chooseOrganization(page) {
    if (page.url().includes('/choose-organization')) {
        const activateButtons = page.getByRole('button', { name: 'Set as active' })
        await activateButtons.first().click()
        await page.waitForURL(`${BASE_URL}/dashboard`, { timeout: 30000 })
        await page.waitForTimeout(1000)
    }
}

async function navigateToFolderView(page) {
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForTimeout(1000)

    const test8Folder = page.getByRole('treeitem', { name: 'test8' })
    if (await test8Folder.isVisible()) {
        await test8Folder.click()
        await page.keyboard.press('ArrowRight')
        await page.waitForTimeout(1500)
    }
}

async function captureScreenshots() {
    await ensureDir()

    const browser = await chromium.launch()
    const indexLines = ['# Production Screenshots', '', `Base URL: ${BASE_URL}`, '']

    try {
        for (const viewport of VIEWPORTS) {
            const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } })
            const page = await context.newPage()

            await login(page)
            await chooseOrganization(page)

            for (const target of PAGES) {
                const url = `${BASE_URL}${target.path}`
                const fileName = `prod-${target.name}-${viewport.name}.png`
                const outputPath = path.join(OUTPUT_DIR, fileName)

                try {
                    if (target.name === 'folder-view') {
                        await navigateToFolderView(page)
                    } else {
                        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
                    }
                    await page.waitForTimeout(1500)
                    await page.screenshot({ path: outputPath, fullPage: false })
                    indexLines.push(`- ${fileName} -> ${url}`)
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error)
                    indexLines.push(`- FAILED ${fileName} -> ${url} (${errorMessage})`)
                }
            }

            await context.close()
        }
    } finally {
        await browser.close()
    }

    await writeIndex(indexLines)
}

await captureScreenshots()
