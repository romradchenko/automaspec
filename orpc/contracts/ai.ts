import { oc } from '@orpc/contract'

import { aiChatRequestSchema, aiChatResponseSchema } from '@/lib/types'

const chatContract = oc
    .route({
        method: 'POST',
        path: '/ai/chat',
        tags: ['ai'],
        summary: 'Chat with AI',
        description: 'Send chat messages to the AI assistant and receive a response'
    })
    .input(aiChatRequestSchema)
    .output(aiChatResponseSchema)

export const aiContract = {
    ai: {
        chat: chatContract
    }
}
