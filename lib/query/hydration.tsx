import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { cache } from 'react'

import { createQueryClient } from './client'

export const getQueryClient = cache(createQueryClient)

/**
 * @deprecated I don't like how hydration works here and don't like this code, so we will probably use useQuery instead
 * @see https://orpc.unnoq.com/docs/integrations/tanstack-query#hydration for updates
 * @see https://tanstack.com/query/latest/docs/framework/react/guides/ssr
 */
export function HydrateClient(props: { children: React.ReactNode; client: QueryClient }) {
    return <HydrationBoundary state={dehydrate(props.client)}>{props.children}</HydrationBoundary>
}
