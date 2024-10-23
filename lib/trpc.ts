'use client'

import { AppRouter } from '@/server/_app'
import { getAccessToken } from '@privy-io/react-auth'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import superjson from 'superjson'
import { isPrivy } from './constants'

const link = httpBatchLink({
  url: `/api/trpc`,
  transformer: superjson,
  async headers() {
    // const token = isPrivy ? await getAccessToken() : (window as any).__TOKEN__
    // return {
    //   authorization: `Bearer privy_${token}`,
    // }
    return {}
  },
})

export const api = createTRPCClient<AppRouter>({
  links: [link],
})

export const trpc = createTRPCReact<AppRouter>({})

export const trpcClient = trpc.createClient({
  links: [link],
})
