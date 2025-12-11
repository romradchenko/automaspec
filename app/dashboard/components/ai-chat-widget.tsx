'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { AI_PROVIDER_LABELS, AI_PROVIDERS } from '@/lib/constants'

import type { AiChatWidgetProps } from './ai-chat.types'

export function AiChatWidget({
    aiOpen,
    aiProvider,
    aiMessageItems,
    aiInput,
    aiError,
    aiIsLoading,
    aiProgress,
    onProviderChange,
    onInputChange,
    onSubmit,
    onToggleOpen,
    onResetChat
}: AiChatWidgetProps) {
    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
            {aiOpen ? (
                <div className="w-80 rounded-lg border bg-background shadow-lg">
                    <div className="flex items-center justify-between border-b px-3 py-2">
                        <div className="flex gap-2">
                            <select
                                className="h-9 rounded-md border bg-background px-2 text-xs"
                                value={aiProvider}
                                onChange={(event) => onProviderChange(event.target.value)}
                            >
                                <option value={AI_PROVIDERS.google}>{AI_PROVIDER_LABELS.google}</option>
                                <option value={AI_PROVIDERS.openrouter}>{AI_PROVIDER_LABELS.openrouter}</option>
                            </select>
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => {
                                    onResetChat()
                                }}
                            >
                                New Chat
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 px-3 py-3">
                        {aiMessageItems.length > 0 ? (
                            <div className="max-h-64 space-y-2 overflow-auto rounded-md border bg-muted p-2 text-sm">
                                {aiMessageItems.map((message) => (
                                    <div key={message.key} className="rounded-md bg-background p-2">
                                        <p className="text-[11px] font-semibold uppercase text-muted-foreground">
                                            {message.role}
                                        </p>
                                        <p className="whitespace-pre-line">{message.content}</p>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                        {aiProgress.length > 0 ? (
                            <div className="space-y-1 rounded-md border bg-muted/60 p-2 text-xs text-muted-foreground">
                                {aiProgress.map((item, index) => (
                                    <div key={`${item}-${index}`}>{item}</div>
                                ))}
                            </div>
                        ) : null}
                        <form className="space-y-2" onSubmit={onSubmit}>
                            <Textarea
                                value={aiInput}
                                onChange={(event) => onInputChange(event.target.value)}
                                rows={3}
                                placeholder="Ask about your tests or requirements"
                            />
                            {aiError ? <p className="text-xs text-red-600">{aiError}</p> : null}
                            <Button type="submit" size="sm" disabled={aiIsLoading} className="w-full">
                                {aiIsLoading ? 'Thinking...' : 'Send'}
                            </Button>
                        </form>
                    </div>
                </div>
            ) : null}
            <Button size="lg" className="rounded-full shadow-lg" onClick={onToggleOpen}>
                {aiOpen ? 'Hide Chat' : 'Chat with AI'}
            </Button>
        </div>
    )
}
