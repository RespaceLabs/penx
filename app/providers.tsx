'use client'

import { ReownWagmiProvider } from '@/components/ReownWagmiProvider'
import { SiteProvider } from '@/components/SiteContext'
import { trpc, trpcClient } from '@/lib/trpc'
import { StoreProvider } from '@/store'
import { Site } from '@plantreexyz/types'
import { AuthType } from '@prisma/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'

const queryClient = new QueryClient()

export function Providers({
  children,
  cookies,
  site,
}: {
  children: React.ReactNode
  cookies: string | null
  site: Site
}) {
  return (
    <SessionProvider>
      <SiteProvider site={site}>
        <Toaster className="dark:hidden" />
        <Toaster theme="dark" className="hidden dark:block" />
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <ReownWagmiProvider cookies={cookies}>
              <StoreProvider>{children}</StoreProvider>
            </ReownWagmiProvider>
          </QueryClientProvider>
        </trpc.Provider>
      </SiteProvider>
    </SessionProvider>
  )
}
