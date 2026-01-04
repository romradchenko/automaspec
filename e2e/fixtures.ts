import { authTest } from '@playwright-kit/auth'

export const test = authTest({ defaultProfile: 'demo', statesDir: '.playwright/auth' })
export const expect = test.expect
