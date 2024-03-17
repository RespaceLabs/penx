import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import fetch from 'node-fetch'
import superjson from 'superjson'
import { Env } from './types'
import { getBaseURL, readConfig } from './utils'

export async function getTRPC(env?: Env) {
  let BASE_URL = ''
  if (!env) {
    const config = readConfig()
    env = config.env
  }

  BASE_URL = getBaseURL('local')

  const config = readConfig()

  const trpc: any = createTRPCProxyClient({
    transformer: superjson,
    links: [
      httpBatchLink({
        url: `${BASE_URL}/api/trpc`,
        fetch: fetch as any,
        async headers() {
          return {
            Authorization: config.token,
          }
        },
      }),
    ],
  })

  return trpc
}
