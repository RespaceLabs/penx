import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import superjson from 'superjson'
import type { AppRouter } from '@penx/api'
import { BASE_URL } from '@penx/constants'

export const api = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: `${BASE_URL}/api/trpc`,
      headers() {
        return {
          Authorization: 'bearer',
        }
      },
    }),
  ],
})

export const trpc = createTRPCReact<AppRouter>()
