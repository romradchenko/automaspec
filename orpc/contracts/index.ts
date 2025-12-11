import { accountContract } from './account'
import { aiContract } from './ai'
import { testsContract } from './tests'

export const contract = {
    ...aiContract,
    ...testsContract,
    ...accountContract
}
