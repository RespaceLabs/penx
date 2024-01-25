import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { QueryClient } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import superjson from 'superjson'
import { BASE_URL } from '@penx/constants'
import { trpc } from './trpc'

export function TrpcProvider(props: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `${BASE_URL}/api/trpc`,
        }),
      ],
    }),
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      {props.children}
    </trpc.Provider>
  )
}
