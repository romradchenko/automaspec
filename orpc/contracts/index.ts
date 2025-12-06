import { accountContract } from './account'
import { analyticsContract } from './analytics'
import { testsContract } from './tests'

export const contract = {
    ...testsContract,
    ...accountContract,
    ...analyticsContract
}
