'use client'

// import type { AppRouter } from '@sponsor3/api'
import { AppRouter } from '@/server/_app'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import superjson from 'superjson'

export const api = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `/api/trpc`,
      transformer: superjson,
      headers() {
        return {
          authorization: `Bearer ${(window as any).__TOKEN__}`,
        }
      },
    }),
  ],
})

export const trpc = createTRPCReact<AppRouter>({})
