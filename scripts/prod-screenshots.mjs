import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const BASE_URL = 'https://automaspec.vercel.app'
const OUTPUT_DIR = path.join(process.cwd(), 'Aliaksandr_Diploma_Submission', 'assets', 'screenshots')
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
    { name: 'analytics', path: '/analytics' },
    { name: 'rpc-docs', path: '/rpc/docs' }
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

async function findFolders(page) {
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForTimeout(2000)

    const allButtons = page.locator('button[type="button"]')
    const buttonCount = await allButtons.count()
    const folders = []
    const seenNames = new Set()

    for (let i = 0; i < buttonCount; i++) {
        const button = allButtons.nth(i)
        const isVisible = await button.isVisible().catch(() => false)
        if (!isVisible) continue

        const svgCount = await button.locator('svg').count()
        if (svgCount < 2) continue

        const text = await button.textContent()
        if (!text || text.trim() === '' || text.includes('Loading...')) continue

        const lines = text
            .trim()
            .split('\n')
            .filter((line) => line.trim().length > 0)
        if (lines.length === 0) continue

        const folderName = lines[lines.length - 1].trim()
        if (folderName && folderName.length > 0 && !seenNames.has(folderName)) {
            seenNames.add(folderName)
            folders.push({ name: folderName })
        }
    }

    return folders
}

async function openFolderAndScreenshot(page, folderName) {
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForTimeout(2000)

    const allButtons = page.locator('button[type="button"]')
    const buttonCount = await allButtons.count()

    for (let i = 0; i < buttonCount; i++) {
        const button = allButtons.nth(i)
        const isVisible = await button.isVisible().catch(() => false)
        if (!isVisible) continue

        const text = await button.textContent()
        if (text && text.includes(folderName)) {
            const svgCount = await button.locator('svg').count()
            if (svgCount >= 2) {
                await button.click()
                await page.waitForTimeout(1500)
                return true
            }
        }
    }

    return false
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
                    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
                    await page.waitForTimeout(1500)
                    await page.screenshot({ path: outputPath, fullPage: false })
                    indexLines.push(`- ${fileName} -> ${url}`)
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error)
                    indexLines.push(`- FAILED ${fileName} -> ${url} (${errorMessage})`)
                }
            }

            const folders = await findFolders(page)
            indexLines.push('', '## Folder Views', '')

            for (const folder of folders) {
                const fileName = `prod-folder-${folder.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${viewport.name}.png`
                const outputPath = path.join(OUTPUT_DIR, fileName)

                try {
                    const opened = await openFolderAndScreenshot(page, folder.name)
                    if (opened) {
                        await page.screenshot({ path: outputPath, fullPage: false })
                        indexLines.push(`- ${fileName} -> Folder: ${folder.name}`)
                    } else {
                        indexLines.push(`- FAILED ${fileName} -> Folder: ${folder.name} (not found)`)
                    }
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error)
                    indexLines.push(`- FAILED ${fileName} -> Folder: ${folder.name} (${errorMessage})`)
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
