import { createClient } from '@libsql/client'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function loadEnv() {
    try {
        const envPath = resolve(process.cwd(), '.env')
        const envContent = readFileSync(envPath, 'utf-8')
        for (const line of envContent.split('\n')) {
            const trimmed = line.trim()
            if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('E2E_DATABASE_URL')) {
                const eqIndex = trimmed.indexOf('=')
                if (eqIndex > 0) {
                    const key = trimmed.slice(0, eqIndex)
                    const value = trimmed.slice(eqIndex + 1)
                    if (!process.env[key]) {
                        process.env[key] = value
                    }
                }
            }
        }
    } catch {
        console.log('No .env file found, using existing environment variables')
    }
}

loadEnv()

function getDatabaseUrl() {
    const url = process.env.NEXT_PUBLIC_DATABASE_URL
    if (!url) {
        throw new Error('NEXT_PUBLIC_DATABASE_URL must be set')
    }
    return url
}

export async function seedTestStructure() {
    const client = createClient({
        url: getDatabaseUrl(),
        authToken: process.env.DATABASE_AUTH_TOKEN
    })

    const userResult = await client.execute({
        sql: 'select id from user where email = ? limit 1',
        args: ['demo@automaspec.com']
    })
    const userId = userResult.rows[0]?.id
    if (typeof userId !== 'string') {
        throw new Error('Demo user not found')
    }

    const memberResult = await client.execute({
        sql: 'select organization_id as organizationId from member where user_id = ? and organization_id is not null limit 1',
        args: [userId]
    })
    const organizationId = memberResult.rows[0]?.organizationId
    if (typeof organizationId !== 'string') {
        throw new Error('Demo user has no organization')
    }

    console.log('📁 Creating folders...')

    await client.execute({
        sql: 'insert into test_folder (id, name, description, parent_folder_id, organization_id) values (?, ?, ?, ?, ?) on conflict(id) do update set name=excluded.name, description=excluded.description',
        args: ['folder-components', 'Components', 'Component tests', null, organizationId]
    })
    console.log('  ✓ Components')

    await client.execute({
        sql: 'insert into test_folder (id, name, description, parent_folder_id, organization_id) values (?, ?, ?, ?, ?) on conflict(id) do update set name=excluded.name, description=excluded.description',
        args: ['folder-database', 'Database', 'Database tests', null, organizationId]
    })
    console.log('  ✓ Database')

    console.log('')
    console.log('📄 Creating specs...')

    const specs = [
        {
            id: 'spec-test-details-panel',
            name: 'Test Details Panel',
            fileName: 'test-details-panel.test.tsx',
            description: 'Test details panel component tests',
            folderId: 'folder-components'
        },
        {
            id: 'spec-tree-component',
            name: 'Tree Component',
            fileName: 'tree-display.test.ts',
            description: 'Tree display component tests',
            folderId: 'folder-components'
        },
        {
            id: 'spec-dashboard-tree',
            name: 'Dashboard Tree View',
            fileName: 'tree.test.tsx',
            description: 'Dashboard tree view tests',
            folderId: 'folder-components'
        },
        {
            id: 'spec-db-test-tables',
            name: 'Database Schema - Test Tables',
            fileName: 'schema.test.ts',
            description: 'Test table schema tests',
            folderId: 'folder-database'
        },
        {
            id: 'spec-db-auth-tables',
            name: 'Database Schema - Auth Tables',
            fileName: 'schema.test.ts',
            description: 'Auth table schema tests',
            folderId: 'folder-database'
        },
        {
            id: 'spec-db-table-columns',
            name: 'Database Schema - Table Columns',
            fileName: 'schema.test.ts',
            description: 'Table columns tests',
            folderId: 'folder-database'
        }
    ]

    for (const spec of specs) {
        await client.execute({
            sql: 'insert into test_spec (id, name, file_name, description, statuses, number_of_tests, folder_id, organization_id) values (?, ?, ?, ?, ?, ?, ?, ?) on conflict(id) do update set name=excluded.name, file_name=excluded.file_name, description=excluded.description',
            args: [
                spec.id,
                spec.name,
                spec.fileName,
                spec.description,
                '{"passed":0,"skipped":0,"todo":0,"failed":0,"pending":0,"disabled":0,"missing":0,"deactivated":0,"partial":0}',
                0,
                spec.folderId,
                organizationId
            ]
        })
        console.log(`  ✓ ${spec.name}`)
    }

    console.log('')
    console.log('✅ Creating requirements...')

    const requirements = [
        { id: 'req-display-spec-details', name: 'should display test spec details', specId: 'spec-test-details-panel' },
        { id: 'req-display-statistics', name: 'should display test statistics', specId: 'spec-test-details-panel' },
        { id: 'req-handle-no-spec', name: 'should handle no spec selected', specId: 'spec-test-details-panel' },

        {
            id: 'req-tree-display-folders',
            name: 'should display test folders in tree structure',
            specId: 'spec-tree-component'
        },

        {
            id: 'req-dashboard-tree-folders',
            name: 'should display test folders in tree structure',
            specId: 'spec-dashboard-tree'
        },
        { id: 'req-dashboard-empty-folders', name: 'should handle empty folders array', specId: 'spec-dashboard-tree' },
        {
            id: 'req-dashboard-specs-in-folders',
            name: 'should display specs in folders',
            specId: 'spec-dashboard-tree'
        },

        { id: 'req-testfolder-table', name: 'should have testFolder table defined', specId: 'spec-db-test-tables' },
        { id: 'req-testspec-table', name: 'should have testSpec table defined', specId: 'spec-db-test-tables' },
        {
            id: 'req-testrequirement-table',
            name: 'should have testRequirement table defined',
            specId: 'spec-db-test-tables'
        },
        { id: 'req-test-table', name: 'should have test table defined', specId: 'spec-db-test-tables' },

        { id: 'req-user-table', name: 'should have user table defined', specId: 'spec-db-auth-tables' },
        { id: 'req-organization-table', name: 'should have organization table defined', specId: 'spec-db-auth-tables' },
        { id: 'req-member-table', name: 'should have member table defined', specId: 'spec-db-auth-tables' },

        {
            id: 'req-testfolder-columns',
            name: 'testFolder should have required columns',
            specId: 'spec-db-table-columns'
        },
        { id: 'req-testspec-columns', name: 'testSpec should have required columns', specId: 'spec-db-table-columns' },
        { id: 'req-test-columns', name: 'test should have required columns', specId: 'spec-db-table-columns' }
    ]

    for (const req of requirements) {
        await client.execute({
            sql: 'insert into test_requirement (id, name, description, spec_id) values (?, ?, ?, ?) on conflict(id) do update set name=excluded.name',
            args: [req.id, req.name, null, req.specId]
        })
        console.log(`    ✓ ${req.name}`)
    }

    console.log('')
    console.log('🧪 Creating tests...')

    for (const req of requirements) {
        const testId = req.id.replace('req-', 'test-')
        await client.execute({
            sql: 'insert into test (id, status, framework, code, requirement_id) values (?, ?, ?, ?, ?) on conflict(id) do update set status=excluded.status',
            args: [testId, 'pending', 'vitest', null, req.id]
        })
    }
    console.log(`    ✓ Created ${requirements.length} tests`)

    client.close()

    console.log('')
    console.log('✅ Seed completed!')
    console.log('')
    console.log('📊 Summary:')
    console.log('  - 2 folders')
    console.log('  - 6 specs')
    console.log('  - 15 requirements')
    console.log('  - 15 tests')
}

seedTestStructure().catch(console.error)
