'use client'

import { WalletConnectProvider } from '@/components/WalletConnectProvider'
import { trpc } from '@/lib/trpc'
import { StoreProvider } from '@/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'
import superjson from 'superjson'

const queryClient = new QueryClient()

const trpcClient = trpc.createClient({
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

export function Providers({
  children,
  cookies,
}: {
  children: React.ReactNode
  cookies: string | null
}) {
  return (
    <SessionProvider>
      <Toaster className="dark:hidden" />
      <Toaster theme="dark" className="hidden dark:block" />
      <WalletConnectProvider cookies={cookies}>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <StoreProvider>{children}</StoreProvider>
          </QueryClientProvider>
        </trpc.Provider>
      </WalletConnectProvider>
    </SessionProvider>
  )
}
