import { afterEach, describe, expect, it, vi } from 'vitest'

import type { Session } from '@/lib/types'

import { createAiTools } from '@/orpc/routes/ai'

vi.mock('@/db', () => ({
    db: {}
}))

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
        activeOrganizationId: 'org-1'
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
})
