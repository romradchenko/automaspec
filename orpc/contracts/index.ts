import { accountContract } from './account'
import { testsContract } from './tests'

export const contract = {
    ...testsContract,
    ...accountContract
}
