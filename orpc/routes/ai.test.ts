import { afterEach, describe, expect, it, vi } from 'vitest'

describe('createAiTools', () => {
    afterEach(() => {
        vi.clearAllMocks()
    })

    it('calls test folder upsert with context and returns success', async () => {
        process.env.NEXT_PUBLIC_DATABASE_URL = 'file:test.db'
        const ai = await import('@/orpc/routes/ai')
        const setMessage = vi.fn()
        const upsertResult = { id: 'folder-123' }
        const createFolder = vi.fn().mockResolvedValue(upsertResult)
        const setRefreshItem = vi.fn()
        const tools = ai.createAiTools({ organizationId: 'org-1' }, setMessage, setRefreshItem, {
            createFolder,
            findFolderByName: vi.fn(),
            createSpec: vi.fn(),
            createRequirements: vi.fn()
        })
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
        expect(result).toEqual({ success: true, folderId: upsertResult.id })
        expect(setMessage).toHaveBeenCalledWith('Created folder "New folder".')
        expect(setRefreshItem).toHaveBeenCalledWith('root')
    })
})
