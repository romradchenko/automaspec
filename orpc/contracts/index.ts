import { testsContract } from './tests'
import { accountContract } from './account'

export const contract = {
    ...testsContract,
    ...accountContract
}
