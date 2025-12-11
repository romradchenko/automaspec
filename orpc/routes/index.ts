import { implement } from '@orpc/server'

import { contract } from '../contracts'
import { accountRouter } from './account'
import { aiRouter } from './ai'
import { analyticsRouter } from './analytics'
import { testsRouter } from './tests'

const os = implement(contract)

export const router = os.router({
    ...aiRouter,
    ...testsRouter,
    ...accountRouter,
    ...analyticsRouter
})
