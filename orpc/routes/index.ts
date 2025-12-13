import { implement } from '@orpc/server'

import { contract } from '../contracts'
import { accountRouter } from './account'
import { analyticsRouter } from './analytics'
import { testsRouter } from './tests'

const os = implement(contract)

export const router = os.router({
    ...testsRouter,
    ...accountRouter,
    ...analyticsRouter
})
