import { accountContract } from './account'
import { aiContract } from './ai'
import { analyticsContract } from './analytics'
import { testsContract } from './tests'

export const contract = {
    ...aiContract,
    ...testsContract,
    ...accountContract,
    ...analyticsContract
}
