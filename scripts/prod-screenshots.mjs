import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const BASE_URL = 'https://automaspec.vercel.app'
const OUTPUT_DIR = path.join(process.cwd(), 'docs_requirments', 'screenshots-prod')

const VIEWPORTS = [
    { name: 'desktop', width: 1920, height: 1080 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 375, height: 667 }
]

const PAGES = [
    { name: 'home', path: '/' },
    { name: 'login', path: '/login' },
    { name: 'dashboard', path: '/dashboard' },
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

async function captureScreenshots() {
    await ensureDir()

    const browser = await chromium.launch()
    const indexLines = ['# Production Screenshots', '', `Base URL: ${BASE_URL}`, '']

    try {
        for (const viewport of VIEWPORTS) {
            const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } })
            const page = await context.newPage()

            for (const target of PAGES) {
                const url = `${BASE_URL}${target.path}`
                const fileName = `prod-${target.name}-${viewport.name}.png`
                const outputPath = path.join(OUTPUT_DIR, fileName)

                try {
                    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
                    await page.waitForTimeout(500)
                    await page.screenshot({ path: outputPath, fullPage: true })
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
