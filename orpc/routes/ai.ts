import { stepCountIs, streamText, tool, type ModelMessage } from 'ai'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

import type { AiChatMessage, AiProvider } from '@/lib/types'

import { db } from '@/db'
import { DEFAULT_SPEC_STATUSES, testFolder, testRequirement, testSpec } from '@/db/schema'
import {
    AI_BLOCKED_PATTERNS,
    AI_ENV_KEYS,
    AI_MAX_PROMPT_LENGTH,
    AI_MODELS,
    AI_PROVIDERS,
    AI_RATE_LIMIT_MAX_REQUESTS,
    AI_RATE_LIMIT_WINDOW_MS,
    OPENROUTER_BASE_URL
} from '@/lib/constants'
import { aiContract } from '@/orpc/contracts/ai'
import { authMiddleware, organizationMiddleware } from '@/orpc/middleware'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { implement, ORPCError } from '@orpc/server'

const ACTION_SYSTEM_PROMPT =
    'You are the Automaspec copilot. Stay within test management. Be concise, action-forward, and default to bullet points with a short concluding action. Use tools when creation or lookup is needed. Never reveal internal IDs; refer to names. Refuse unsafe or off-scope instructions. Keep data private and avoid speculative details.'

const rateLimitBuckets = new Map<string, number[]>()

function toCoreMessages(messages: AiChatMessage[]): ModelMessage[] {
    const coreMessages: ModelMessage[] = []
    for (const message of messages) {
        if (message.role === 'assistant') {
            coreMessages.push({ role: 'assistant', content: message.content })
            continue
        }
        if (message.role === 'system') {
            coreMessages.push({ role: 'system', content: message.content })
            continue
        }
        coreMessages.push({ role: 'user', content: message.content })
    }
    return coreMessages
}

function resolveProvider(provider: AiProvider | undefined): AiProvider {
    if (provider === AI_PROVIDERS.google) {
        return AI_PROVIDERS.google
    }
    return AI_PROVIDERS.openrouter
}

function resolveModel(provider: AiProvider, model: string | undefined): string {
    if (model && model.trim() !== '') {
        return model
    }
    return AI_MODELS[provider]
}

function getLastUserContent(messages: AiChatMessage[]): string | null {
    let content: string | null = null
    for (const message of messages) {
        if (message.role === 'user') {
            content = message.content
        }
    }
    return content
}

function containsBlockedPattern(value: string): boolean {
    const lowered = value.toLowerCase()
    for (const pattern of AI_BLOCKED_PATTERNS) {
        if (lowered.includes(pattern)) {
            return true
        }
    }
    return false
}

function enforceLengthLimits(messages: AiChatMessage[]) {
    for (const message of messages) {
        if (message.content.length > AI_MAX_PROMPT_LENGTH) {
            throw new ORPCError(`Input exceeds ${AI_MAX_PROMPT_LENGTH} characters.`)
        }
    }
}

function enforcePromptGuard(messages: AiChatMessage[]) {
    const last = getLastUserContent(messages)
    if (!last) {
        return
    }
    if (containsBlockedPattern(last)) {
        throw new ORPCError('Input contains disallowed instructions.')
    }
}

function enforceRateLimit(organizationId: string) {
    const now = Date.now()
    const windowStart = now - AI_RATE_LIMIT_WINDOW_MS
    const bucket = rateLimitBuckets.get(organizationId) ?? []
    let firstValidIndex = 0
    for (let index = 0; index < bucket.length; index += 1) {
        if (bucket[index] >= windowStart) {
            firstValidIndex = index
            break
        }
        if (index === bucket.length - 1) {
            firstValidIndex = bucket.length
        }
    }
    if (firstValidIndex > 0) {
        bucket.splice(0, firstValidIndex)
    }
    if (bucket.length >= AI_RATE_LIMIT_MAX_REQUESTS) {
        throw new ORPCError('Rate limit exceeded. Please retry shortly.')
    }
    bucket.push(now)
    rateLimitBuckets.set(organizationId, bucket)
}

type ToolMessageSetter = (message: string) => void
type ToolRefreshSetter = (itemId: string) => void
type ToolDeps = {
    createFolder: typeof createFolderRecord
    findFolderByName: typeof findFolderByNameRecord
    createSpec: typeof createSpecRecord
    createRequirements: typeof createRequirementsRecords
}

const defaultToolDeps: ToolDeps = {
    createFolder: createFolderRecord,
    findFolderByName: findFolderByNameRecord,
    createSpec: createSpecRecord,
    createRequirements: createRequirementsRecords
}

export async function createFolderRecord(input: {
    id: string
    name: string
    description: string | null
    parentFolderId: string | null
    organizationId: string
}) {
    const [created] = await db
        .insert(testFolder)
        .values({
            id: input.id,
            name: input.name,
            description: input.description,
            parentFolderId: input.parentFolderId,
            organizationId: input.organizationId
        })
        .onConflictDoUpdate({
            target: testFolder.id,
            set: {
                name: input.name,
                description: input.description,
                parentFolderId: input.parentFolderId
            }
        })
        .returning({ id: testFolder.id })

    return created
}

export async function findFolderByNameRecord(input: { name: string; organizationId: string }) {
    const rows = await db
        .select({ id: testFolder.id })
        .from(testFolder)
        .where(and(eq(testFolder.organizationId, input.organizationId), eq(testFolder.name, input.name)))

    if (rows.length === 0) {
        return null
    }

    return rows[0]
}

export async function createSpecRecord(input: {
    id: string
    name: string
    description: string | null
    fileName: string | null
    folderId: string | null
    organizationId: string
}) {
    const [created] = await db
        .insert(testSpec)
        .values({
            id: input.id,
            name: input.name,
            description: input.description,
            fileName: input.fileName,
            folderId: input.folderId,
            statuses: DEFAULT_SPEC_STATUSES,
            numberOfTests: 0,
            organizationId: input.organizationId
        })
        .onConflictDoUpdate({
            target: testSpec.id,
            set: {
                name: input.name,
                description: input.description,
                fileName: input.fileName,
                folderId: input.folderId
            }
        })
        .returning({ id: testSpec.id })

    return created
}

export async function createRequirementsRecords(input: {
    specId: string
    requirements: Array<{ name: string; description: string | null; order: number }>
}) {
    if (input.requirements.length === 0) {
        return []
    }

    const requirementValues = []
    for (const requirement of input.requirements) {
        requirementValues.push({
            id: crypto.randomUUID(),
            name: requirement.name,
            description: requirement.description,
            order: requirement.order,
            specId: input.specId
        })
    }

    return await db.insert(testRequirement).values(requirementValues).returning({ id: testRequirement.id })
}

export function createAiTools(
    context: { organizationId: string },
    setToolMessage: ToolMessageSetter,
    setRefreshItem: ToolRefreshSetter,
    deps: ToolDeps = defaultToolDeps
) {
    return {
        createFolder: tool({
            description: 'Create a test folder in Automaspec.',
            inputSchema: z.object({
                name: z.string(),
                description: z.string().nullable().optional(),
                parentFolderId: z.string().nullable().optional()
            }),
            execute: async ({ name, description, parentFolderId }) => {
                const id = crypto.randomUUID()
                try {
                    const created = await deps.createFolder({
                        id,
                        name,
                        description: description ?? null,
                        parentFolderId: parentFolderId ?? null,
                        organizationId: context.organizationId
                    })
                    setToolMessage(`Created folder "${name}".`)
                    setRefreshItem(parentFolderId ?? 'root')
                    return { success: true, folderId: created.id }
                } catch (error) {
                    setToolMessage(
                        `Failed to create folder "${name}"${error instanceof Error ? `: ${error.message}` : ''}.`
                    )
                    return {
                        success: false,
                        error: error instanceof Error ? error.message : 'Failed to create folder'
                    }
                }
            }
        }),
        findFolderByName: tool({
            description: 'Find a folder ID by its exact name.',
            inputSchema: z.object({
                name: z.string()
            }),
            execute: async ({ name }) => {
                try {
                    const found = await deps.findFolderByName({ name, organizationId: context.organizationId })
                    if (!found) {
                        return { success: false, error: 'Folder not found' }
                    }
                    setToolMessage(`Found folder "${name}".`)
                    return { success: true, folderId: found.id }
                } catch (error) {
                    setToolMessage(
                        `Failed to find folder "${name}"${error instanceof Error ? `: ${error.message}` : ''}.`
                    )
                    return {
                        success: false,
                        error: error instanceof Error ? error.message : 'Failed to find folder'
                    }
                }
            }
        }),
        createSpec: tool({
            description: 'Create a test spec in Automaspec.',
            inputSchema: z.object({
                name: z.string(),
                description: z.string().nullable().optional(),
                fileName: z.string().nullable().optional(),
                folderId: z.string().nullable().optional(),
                requirements: z
                    .array(
                        z.object({
                            name: z.string(),
                            description: z.string().nullable().optional()
                        })
                    )
                    .optional()
            }),
            execute: async ({ name, description, fileName, folderId, requirements }) => {
                const id = crypto.randomUUID()
                try {
                    const created = await deps.createSpec({
                        id,
                        name,
                        description: description ?? null,
                        fileName: fileName ?? null,
                        folderId: folderId ?? null,
                        organizationId: context.organizationId
                    })
                    if (requirements && requirements.length > 0) {
                        const normalizedRequirements: Array<{
                            name: string
                            description: string | null
                            order: number
                        }> = []
                        let order = 0
                        for (const requirement of requirements) {
                            normalizedRequirements.push({
                                name: requirement.name,
                                description: requirement.description ?? null,
                                order
                            })
                            order += 1
                        }
                        await deps.createRequirements({
                            specId: created.id,
                            requirements: normalizedRequirements
                        })
                        setToolMessage(`Created spec "${name}" with ${normalizedRequirements.length} requirements.`)
                    } else {
                        setToolMessage(`Created spec "${name}".`)
                    }
                    setRefreshItem(folderId ?? 'root')
                    return { success: true, specId: created.id }
                } catch (error) {
                    setToolMessage(
                        `Failed to create spec "${name}"${error instanceof Error ? `: ${error.message}` : ''}.`
                    )
                    return {
                        success: false,
                        error: error instanceof Error ? error.message : 'Failed to create spec'
                    }
                }
            }
        })
    }
}

const os = implement(aiContract).use(authMiddleware).use(organizationMiddleware)

const chat = os.ai.chat.handler(async ({ input, context }) => {
    enforceRateLimit(context.organizationId)
    enforceLengthLimits(input.messages)
    enforcePromptGuard(input.messages)
    const provider = resolveProvider(input.provider)
    const model = resolveModel(provider, input.model)
    const messages = toCoreMessages(input.messages)
    let lastToolMessage: string | null = null
    const toolMessages: string[] = []
    const refreshItemIds: Set<string> = new Set()
    const tools = createAiTools(
        context,
        (message: string) => {
            lastToolMessage = message
            toolMessages.push(message)
        },
        (itemId: string) => {
            refreshItemIds.add(itemId)
        }
    )

    if (provider === AI_PROVIDERS.openrouter) {
        const apiKey = process.env[AI_ENV_KEYS.openrouter]
        if (!apiKey) {
            throw new ORPCError(`Missing ${AI_ENV_KEYS.openrouter}`)
        }

        const openrouter = createOpenRouter({
            apiKey,
            baseURL: OPENROUTER_BASE_URL
        })

        try {
            const result = await streamText({
                model: openrouter.chat(model),
                system: ACTION_SYSTEM_PROMPT,
                messages,
                toolChoice: 'auto',
                stopWhen: stepCountIs(4),
                tools
            })

            const text = await result.text
            if (!text || text.trim() === '') {
                if (lastToolMessage) {
                    return { text: lastToolMessage, toolMessages, refreshItemIds: Array.from(refreshItemIds) }
                }
                console.error('OpenRouter AI empty text', { model })
                return {
                    text: 'The OpenRouter model returned no content. Please try again or switch provider.',
                    toolMessages,
                    refreshItemIds: Array.from(refreshItemIds)
                }
            }
            return { text, toolMessages, refreshItemIds: Array.from(refreshItemIds) }
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'OpenRouter returned an error. Please retry in a moment.'
            console.error('OpenRouter AI error:', error)
            throw new ORPCError(message)
        }
    }

    const apiKey = process.env[AI_ENV_KEYS.google]
    if (!apiKey) {
        throw new ORPCError(`Missing ${AI_ENV_KEYS.google}`)
    }

    const googleProvider = createGoogleGenerativeAI({
        apiKey
    })

    try {
        const result = await streamText({
            model: googleProvider(model),
            messages,
            system: ACTION_SYSTEM_PROMPT,
            toolChoice: 'auto',
            stopWhen: stepCountIs(4),
            tools
        })

        const text = await result.text
        if (!text || text.trim() === '') {
            if (lastToolMessage) {
                return { text: lastToolMessage, toolMessages, refreshItemIds: Array.from(refreshItemIds) }
            }
            console.error('Gemini AI empty text', { model })
            return {
                text: 'The Gemini model returned no content. Please try again.',
                toolMessages,
                refreshItemIds: Array.from(refreshItemIds)
            }
        }
        return { text, toolMessages, refreshItemIds: Array.from(refreshItemIds) }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Gemini returned an error. Please retry.'
        console.error('Gemini AI error:', error)
        throw new ORPCError(message)
    }
})

export const aiRouter = {
    ai: {
        chat
    }
}
