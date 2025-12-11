'use client'

import { useState, type FormEvent } from 'react'

import type { AiChatMessage, AiProvider } from '@/lib/types'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AI_BLOCKED_PATTERNS, AI_MAX_PROMPT_LENGTH, AI_MODELS, AI_PROVIDER_LABELS, AI_PROVIDERS } from '@/lib/constants'
import { safeClient } from '@/lib/orpc/orpc'

export default function AiPage() {
    const [messages, setMessages] = useState<AiChatMessage[]>([])
    const [input, setInput] = useState('')
    const [provider, setProvider] = useState<AiProvider>(AI_PROVIDERS.openrouter)
    const [model, setModel] = useState<string>(AI_MODELS[AI_PROVIDERS.openrouter])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleProviderChange = (value: string) => {
        if (value === AI_PROVIDERS.google) {
            setProvider(AI_PROVIDERS.google)
            setModel(AI_MODELS[AI_PROVIDERS.google])
            return
        }

        setProvider(AI_PROVIDERS.openrouter)
        setModel(AI_MODELS[AI_PROVIDERS.openrouter])
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const trimmedInput = input.trim()
        if (trimmedInput === '') {
            return
        }

        if (trimmedInput.length > AI_MAX_PROMPT_LENGTH) {
            setError(`Message exceeds ${AI_MAX_PROMPT_LENGTH} characters.`)
            return
        }

        for (const pattern of AI_BLOCKED_PATTERNS) {
            if (trimmedInput.toLowerCase().includes(pattern)) {
                setError('Message contains disallowed instructions.')
                return
            }
        }

        const nextMessages: AiChatMessage[] = [...messages, { role: 'user', content: trimmedInput }]
        setMessages(nextMessages)
        setInput('')
        setIsLoading(true)
        setError(null)

        const { data, error: rpcError } = await safeClient.ai.chat({
            messages: nextMessages,
            provider,
            model
        })

        if (rpcError) {
            setError(rpcError.message || 'Request failed')
            setIsLoading(false)
            return
        }

        if (!data?.text || data.text.trim() === '') {
            setError('No response received')
            setIsLoading(false)
            return
        }

        const assistantMessage: AiChatMessage = { role: 'assistant', content: data.text }
        setMessages([...nextMessages, assistantMessage])
        setIsLoading(false)
    }

    const handleReset = () => {
        setMessages([])
        setError(null)
    }

    return (
        <div className="mx-auto flex max-w-4xl flex-col gap-6 p-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-semibold">AI Assistant</h1>
                <p className="text-muted-foreground">
                    Run prompts using the bundled OpenRouter free model or Google Gemini.
                </p>
            </div>

            <form className="space-y-4 rounded-lg border p-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="provider">Provider</Label>
                        <select
                            id="provider"
                            value={provider}
                            onChange={(event) => handleProviderChange(event.target.value)}
                            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                        >
                            <option value={AI_PROVIDERS.openrouter}>{AI_PROVIDER_LABELS.openrouter}</option>
                            <option value={AI_PROVIDERS.google}>{AI_PROVIDER_LABELS.google}</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="model">Model</Label>
                        <Input
                            id="model"
                            value={model}
                            onChange={(event) => setModel(event.target.value)}
                            placeholder="gemini-2.5-flash"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="prompt">Prompt</Label>
                    <Textarea
                        id="prompt"
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        rows={4}
                        placeholder="Ask anything about your tests or requirements"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <Button type="submit" disabled={isLoading} className="w-fit">
                        {isLoading ? 'Running...' : 'Send'}
                    </Button>
                    <Button type="button" variant="secondary" onClick={handleReset} disabled={isLoading}>
                        New chat
                    </Button>
                </div>

                {error ? <p className="text-sm text-red-600">{error}</p> : null}
            </form>

            <div className="space-y-3 rounded-lg border p-4">
                {messages.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Start a conversation to see replies here.</p>
                ) : (
                    <div className="space-y-3">
                        {messages.map((message, index) => (
                            <div key={`${message.role}-${index}`} className="rounded-md bg-muted p-3">
                                <p className="text-xs font-medium uppercase text-muted-foreground">{message.role}</p>
                                <p className="whitespace-pre-line">{message.content}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
