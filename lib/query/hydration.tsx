import { cache } from 'react'

import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'

import { createQueryClient } from './client'

// oxlint-disable-next-line only-export-components
export const getQueryClient = cache(createQueryClient)

/**
 * @deprecated I don't like how hydration works here and don't like this code, so we will probably use useQuery instead
 * @see https://orpc.unnoq.com/docs/integrations/tanstack-query#hydration for updates
 * @see https://tanstack.com/query/latest/docs/framework/react/guides/ssr
 */
export function HydrateClient(props: { children: React.ReactNode; client: QueryClient }) {
    return <HydrationBoundary state={dehydrate(props.client)}>{props.children}</HydrationBoundary>
}
