import pino from 'pino'
import pretty from 'pino-pretty'

import { NODE_ENVS } from '@/lib/constants'

function isProductionNodeEnv() {
    return process.env.NODE_ENV === NODE_ENVS.production
}

export function createServerLogger() {
    if (isProductionNodeEnv()) {
        return pino()
    }

    return pino(pretty({ colorize: true, singleLine: true }))
}
