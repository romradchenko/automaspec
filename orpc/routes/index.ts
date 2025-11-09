import { implement } from '@orpc/server'
import { contract } from '../contracts'
import { testsRouter } from './tests'
import { accountRouter } from './account'

const os = implement(contract)

export const router = os.router({
    ...testsRouter,
    ...accountRouter
})
