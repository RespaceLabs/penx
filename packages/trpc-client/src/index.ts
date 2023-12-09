import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import superjson from 'superjson'
import type { AppRouter } from '@penx/api'
import { BASE_URL } from '@penx/constants'

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: `${BASE_URL}/api/trpc`,
    }),
  ],
})
