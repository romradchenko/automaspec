import type { FormEvent } from 'react'

import type { AiChatMessage, AiProvider } from '@/lib/types'

export type AiChatListItem = {
    role: AiChatMessage['role']
    content: string
    key: string
}

export interface AiChatWidgetProps {
    aiOpen: boolean
    aiProvider: AiProvider
    aiMessageItems: AiChatListItem[]
    aiInput: string
    aiError: string | null
    aiIsLoading: boolean
    aiProgress: string[]
    onProviderChange: (value: string) => void
    onInputChange: (value: string) => void
    onSubmit: (event: FormEvent<HTMLFormElement>) => void
    onToggleOpen: () => void
    onResetChat: () => void
}
