import { createTRPCProxyClient, httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'
import superjson from 'superjson'
import type { AppRouter } from '@penx/api'
import { BASE_URL } from '@penx/constants'

export const api = createTRPCNext<AppRouter>({
  config(opts) {
    const { ctx } = opts
    if (typeof window !== 'undefined') {
      // during client requests
      return {
        transformer: superjson, // optional - adds superjson serialization
        links: [
          httpBatchLink({
            url: `${BASE_URL}/api/trpc`,
          }),
        ],
      }
    }

    return {
      transformer: superjson, // optional - adds superjson serialization
      links: [
        httpBatchLink({
          // The server needs to know your app's full url
          url: `${BASE_URL}/api/trpc`,
          /**
           * Set custom request headers on every request from tRPC
           * @link https://trpc.io/docs/v10/header
           */
          headers() {
            if (!ctx?.req?.headers) {
              return {}
            }
            // To use SSR properly, you need to forward client headers to the server
            // This is so you can pass through things like cookies when we're server-side rendering
            return {
              cookie: ctx.req.headers.cookie,
            }
          },
        }),
      ],
    }
  },
  ssr: true,
})

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: `${BASE_URL}/api/trpc`,
      // You can pass any HTTP headers you wish here
    }),
  ],
})

export { type RouterInputs, type RouterOutputs } from '@penx/api'
