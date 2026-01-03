import { createRouterClient } from '@orpc/server'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { AiChatMessage, Session } from '@/lib/types'

import {
    AI_BLOCKED_PATTERNS,
    AI_ENV_KEYS,
    AI_MAX_PROMPT_LENGTH,
    AI_MODELS,
    AI_PROVIDERS,
    AI_RATE_LIMIT_MAX_REQUESTS,
    NODE_ENVS
} from '@/lib/constants'
import { router } from '@/orpc/routes'
import {
    clearRateLimitBuckets,
    containsBlockedPattern,
    createAiTools,
    enforceLengthLimits,
    enforcePromptGuard,
    enforceRateLimit,
    getLastUserContent,
    resolveModel,
    resolveProvider,
    toCoreMessages
} from '@/orpc/routes/ai'

const aiSdkMocks = vi.hoisted(() => {
    return {
        streamText: vi.fn(),
        stepCountIs: vi.fn(() => true)
    }
})

vi.mock('ai', () => {
    return {
        streamText: aiSdkMocks.streamText,
        stepCountIs: aiSdkMocks.stepCountIs,
        tool: (config: unknown) => config
    }
})

const providerMocks = vi.hoisted(() => {
    return {
        createOpenRouter: vi.fn(() => {
            return { chat: vi.fn((model: string) => `openrouter:${model}`) }
        }),
        createGoogleGenerativeAI: vi.fn(() => {
            return (model: string) => `google:${model}`
        })
    }
})

vi.mock('@openrouter/ai-sdk-provider', () => {
    return { createOpenRouter: providerMocks.createOpenRouter }
})

vi.mock('@ai-sdk/google', () => {
    return { createGoogleGenerativeAI: providerMocks.createGoogleGenerativeAI }
})

vi.mock('@/db', () => {
    return { db: {} }
})

const session = {
    user: {
        id: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        email: 'user@example.com',
        emailVerified: true,
        name: 'User'
    },
    session: {
        activeOrganizationId: 'org-1',
        userId: 'user-1'
    }
}

describe('createAiTools', () => {
    afterEach(() => {
        vi.clearAllMocks()
    })

    it('calls test folder upsert with context and returns success', async () => {
        const setMessage = vi.fn()
        const upsertResult = { id: 'folder-123' }
        const createFolder = vi.fn().mockResolvedValue(upsertResult)
        const setRefreshItem = vi.fn()
        const tools = createAiTools(
            { organizationId: 'org-1', session: session as unknown as Session },
            setMessage,
            setRefreshItem,
            {
                createFolder,
                findFolderByName: vi.fn(),
                createSpec: vi.fn(),
                replaceRequirementsForSpec: vi.fn()
            }
        )
        const execute = tools.createFolder.execute
        if (!execute) {
            throw new Error('execute missing')
        }
        const result = await execute(
            {
                name: 'New folder',
                description: null,
                parentFolderId: null
            },
            { toolCallId: 'test-call', messages: [] }
        )

        const firstCall = createFolder.mock.calls[0]?.[0]
        expect(firstCall?.organizationId).toBe('org-1')
        expect(firstCall?.name).toBe('New folder')
        expect(firstCall?.description).toBeNull()
        expect(firstCall?.parentFolderId).toBeNull()
        expect(typeof firstCall?.id).toBe('string')
        expect(firstCall?.session).toBe(session)
        expect(result).toEqual({ success: true, folderId: upsertResult.id })
        expect(setMessage).toHaveBeenCalledWith('Created folder "New folder".')
        expect(setRefreshItem).toHaveBeenCalledWith('root')
    })

    it('returns failure when folder is not found by name', async () => {
        const tools = createAiTools(
            { organizationId: 'org-1', session: session as unknown as Session },
            vi.fn(),
            vi.fn(),
            {
                createFolder: vi.fn(),
                findFolderByName: vi.fn().mockResolvedValue(null),
                createSpec: vi.fn(),
                replaceRequirementsForSpec: vi.fn()
            }
        )

        const execute = tools.findFolderByName.execute
        if (!execute) {
            throw new Error('execute missing')
        }

        const result = await execute({ name: 'Missing' }, { toolCallId: 'test-call', messages: [] })
        expect(result).toEqual({ success: false, error: 'Folder not found' })
    })

    it('creates a spec and replaces requirements', async () => {
        const setMessage = vi.fn()
        const setRefreshItem = vi.fn()
        const createSpec = vi.fn().mockResolvedValue({ id: 'spec-1' })
        const replaceRequirementsForSpec = vi.fn().mockResolvedValue(undefined)
        const tools = createAiTools(
            { organizationId: 'org-1', session: session as unknown as Session },
            setMessage,
            setRefreshItem,
            {
                createFolder: vi.fn(),
                findFolderByName: vi.fn(),
                createSpec,
                replaceRequirementsForSpec
            }
        )

        const execute = tools.createSpec.execute
        if (!execute) {
            throw new Error('execute missing')
        }

        const result = await execute(
            {
                name: 'Spec A',
                description: null,
                fileName: null,
                folderId: 'folder-1',
                requirements: [{ name: 'Req A', description: null }]
            },
            { toolCallId: 'test-call', messages: [] }
        )

        expect(result).toEqual({ success: true, specId: 'spec-1' })
        expect(setMessage).toHaveBeenCalledWith('Created spec "Spec A" with 1 requirements.')
        expect(setRefreshItem).toHaveBeenCalledWith('folder-1')
    })

    it('returns failure when create folder throws', async () => {
        const setMessage = vi.fn()
        const tools = createAiTools(
            { organizationId: 'org-1', session: session as unknown as Session },
            setMessage,
            vi.fn(),
            {
                createFolder: vi.fn().mockRejectedValue(new Error('boom')),
                findFolderByName: vi.fn(),
                createSpec: vi.fn(),
                replaceRequirementsForSpec: vi.fn()
            }
        )

        const execute = tools.createFolder.execute
        if (!execute) {
            throw new Error('execute missing')
        }

        const result = await execute(
            { name: 'Folder', description: null, parentFolderId: null },
            { toolCallId: 'x', messages: [] }
        )
        expect(result).toEqual(expect.objectContaining({ success: false }))
        expect(setMessage).toHaveBeenCalled()
    })
})

describe('ai helpers', () => {
    it('normalizes messages to core messages', () => {
        const messages = [
            { role: 'user', content: 'Hello' },
            { role: 'assistant', content: 'Hi' },
            { role: 'system', content: 'System' }
        ] satisfies AiChatMessage[]

        expect(toCoreMessages(messages)).toEqual([
            { role: 'user', content: 'Hello' },
            { role: 'assistant', content: 'Hi' },
            { role: 'system', content: 'System' }
        ])
    })

    it('resolves provider and model defaults', () => {
        expect(resolveProvider(AI_PROVIDERS.google)).toBe(AI_PROVIDERS.google)
        expect(resolveProvider(undefined)).toBe(AI_PROVIDERS.openrouter)
        expect(resolveModel(AI_PROVIDERS.openrouter, '')).toBe(AI_MODELS.openrouter)
        expect(resolveModel(AI_PROVIDERS.google, undefined)).toBe(AI_MODELS.google)
        expect(resolveModel(AI_PROVIDERS.google, 'custom')).toBe('custom')
    })

    it('finds last user content and blocked patterns', () => {
        const messages = [
            { role: 'user', content: 'First' },
            { role: 'assistant', content: 'Response' },
            { role: 'user', content: 'Second' }
        ] satisfies AiChatMessage[]

        expect(getLastUserContent(messages)).toBe('Second')
        expect(getLastUserContent([{ role: 'assistant', content: 'No user' }] satisfies AiChatMessage[])).toBeNull()
        expect(containsBlockedPattern(`Some text ${AI_BLOCKED_PATTERNS[0] ?? ''}`)).toBe(true)
        expect(containsBlockedPattern('Safe input')).toBe(false)
    })

    it('enforces prompt guard and length limits', () => {
        expect(() =>
            enforcePromptGuard([{ role: 'assistant', content: 'No user' }] satisfies AiChatMessage[])
        ).not.toThrow()
        expect(() => enforcePromptGuard([{ role: 'user', content: AI_BLOCKED_PATTERNS[0] ?? '' }])).toThrow(
            'Input contains disallowed instructions.'
        )

        const tooLong = ''.padEnd(AI_MAX_PROMPT_LENGTH + 1, 'a')
        expect(() => enforceLengthLimits([{ role: 'user', content: tooLong }] satisfies AiChatMessage[])).toThrow(
            'Input exceeds'
        )
    })

    it('enforces rate limits per organization', () => {
        clearRateLimitBuckets()
        for (let i = 0; i < AI_RATE_LIMIT_MAX_REQUESTS; i += 1) {
            enforceRateLimit('org-1')
        }
        expect(() => enforceRateLimit('org-1')).toThrow('Rate limit exceeded')
        clearRateLimitBuckets()
    })
})

describe('ai.chat', () => {
    const client = createRouterClient(router, { context: async () => ({ session: session as unknown as Session }) })

    afterEach(() => {
        vi.unstubAllEnvs()
        clearRateLimitBuckets()
        aiSdkMocks.streamText.mockReset()
    })

    it('rejects when openrouter key is missing', async () => {
        vi.stubEnv('NODE_ENV', NODE_ENVS.test)
        await expect(
            client.ai.chat({ provider: AI_PROVIDERS.openrouter, messages: [{ role: 'user', content: 'Hi' }] })
        ).rejects.toThrow(`Missing ${AI_ENV_KEYS.openrouter}`)
    })

    it('returns text from openrouter stream', async () => {
        vi.stubEnv('NODE_ENV', NODE_ENVS.test)
        vi.stubEnv(AI_ENV_KEYS.openrouter, 'key')
        aiSdkMocks.streamText.mockReturnValue({ text: Promise.resolve('Hello') })

        const result = await client.ai.chat({
            provider: AI_PROVIDERS.openrouter,
            messages: [{ role: 'user', content: 'Hi' }]
        })

        expect(result.text).toBe('Hello')
        expect(Array.isArray(result.toolMessages)).toBe(true)
        expect(Array.isArray(result.refreshItemIds)).toBe(true)
    })

    it('returns fallback text when openrouter stream is empty', async () => {
        vi.stubEnv('NODE_ENV', NODE_ENVS.test)
        vi.stubEnv(AI_ENV_KEYS.openrouter, 'key')
        aiSdkMocks.streamText.mockReturnValue({ text: Promise.resolve('') })

        const result = await client.ai.chat({
            provider: AI_PROVIDERS.openrouter,
            messages: [{ role: 'user', content: 'Hi' }]
        })

        expect(result.text).toContain('returned no content')
    })

    it('rejects when google key is missing', async () => {
        vi.stubEnv('NODE_ENV', NODE_ENVS.test)
        await expect(
            client.ai.chat({ provider: AI_PROVIDERS.google, messages: [{ role: 'user', content: 'Hi' }] })
        ).rejects.toThrow(`Missing ${AI_ENV_KEYS.google}`)
    })

    it('returns text from google stream', async () => {
        vi.stubEnv('NODE_ENV', NODE_ENVS.test)
        vi.stubEnv(AI_ENV_KEYS.google, 'key')
        aiSdkMocks.streamText.mockReturnValue({ text: Promise.resolve('Hello') })

        const result = await client.ai.chat({
            provider: AI_PROVIDERS.google,
            messages: [{ role: 'user', content: 'Hi' }]
        })

        expect(result.text).toBe('Hello')
    })
})
