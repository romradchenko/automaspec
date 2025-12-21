import { oc } from '@orpc/contract'

import { aiChatRequestSchema, aiChatResponseSchema } from '@/lib/types'

const chatContract = oc
    .route({ method: 'POST', path: '/ai/chat', tags: ['ai'], description: 'Chat with AI assistant' })
    .input(aiChatRequestSchema)
    .output(aiChatResponseSchema)

export const aiContract = {
    ai: {
        chat: chatContract
    }
}
