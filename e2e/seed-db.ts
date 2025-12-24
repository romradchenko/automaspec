import { createClient } from '@libsql/client'

function getE2eDatabaseUrl() {
    const url = process.env.E2E_DATABASE_URL
    if (!url) {
        throw new Error('E2E_DATABASE_URL must be set')
    }
    return url
}

export async function seedE2eDatabase() {
    const client = createClient({
        url: getE2eDatabaseUrl(),
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

    await client.execute({
        sql: 'update organization set name = ? where id = ?',
        args: ['Automaspec Org', organizationId]
    })

    await client.execute({
        sql: 'delete from test_folder where organization_id = ? and name = ? and id != ?',
        args: [organizationId, 'Dashboard Tests', 'e2e-folder-dashboard']
    })

    await client.execute({
        sql: 'insert into test_folder (id, name, description, parent_folder_id, organization_id) values (?, ?, ?, ?, ?) on conflict(id) do update set name=excluded.name, description=excluded.description, parent_folder_id=excluded.parent_folder_id, organization_id=excluded.organization_id',
        args: ['e2e-folder-dashboard', 'Dashboard Tests', 'Tests for dashboard functionality', null, organizationId]
    })

    await client.execute({
        sql: 'delete from test_spec where organization_id = ? and name = ? and id != ?',
        args: [organizationId, 'Dashboard Tree View', 'e2e-spec-dashboard-tree']
    })

    await client.execute({
        sql: 'insert into test_spec (id, name, file_name, description, statuses, number_of_tests, folder_id, organization_id) values (?, ?, ?, ?, ?, ?, ?, ?) on conflict(id) do update set name=excluded.name, file_name=excluded.file_name, description=excluded.description, statuses=excluded.statuses, number_of_tests=excluded.number_of_tests, folder_id=excluded.folder_id, organization_id=excluded.organization_id',
        args: [
            'e2e-spec-dashboard-tree',
            'Dashboard Tree View',
            'dashboard-tree.spec.ts',
            'Tree navigation and folder content rendering',
            '{"passed":2,"skipped":0,"todo":0,"failed":0,"pending":0,"disabled":0,"missing":0,"deactivated":0,"partial":0}',
            2,
            'e2e-folder-dashboard',
            organizationId
        ]
    })

    await client.execute({
        sql: 'insert into test_requirement (id, name, description, spec_id) values (?, ?, ?, ?) on conflict(id) do update set name=excluded.name, description=excluded.description, spec_id=excluded.spec_id',
        args: [
            'e2e-req-display-folders',
            'Display folders in tree',
            'Tree renders root folders',
            'e2e-spec-dashboard-tree'
        ]
    })

    await client.execute({
        sql: 'insert into test_requirement (id, name, description, spec_id) values (?, ?, ?, ?) on conflict(id) do update set name=excluded.name, description=excluded.description, spec_id=excluded.spec_id',
        args: [
            'e2e-req-select-spec',
            'Select spec shows details',
            'Selecting a spec loads details and requirements',
            'e2e-spec-dashboard-tree'
        ]
    })

    await client.execute({
        sql: 'insert into test (id, status, framework, code, requirement_id) values (?, ?, ?, ?, ?) on conflict(id) do update set status=excluded.status, framework=excluded.framework, code=excluded.code, requirement_id=excluded.requirement_id',
        args: ['e2e-test-tree-defined', 'passed', 'vitest', 'expect(tree).toBeDefined()', 'e2e-req-display-folders']
    })

    await client.execute({
        sql: 'insert into test (id, status, framework, code, requirement_id) values (?, ?, ?, ?, ?) on conflict(id) do update set status=excluded.status, framework=excluded.framework, code=excluded.code, requirement_id=excluded.requirement_id',
        args: ['e2e-test-details-defined', 'passed', 'vitest', 'expect(details).toBeDefined()', 'e2e-req-select-spec']
    })

    client.close()
}
