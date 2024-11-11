'use client'

import { Suspense } from 'react'
import { GoogleOauthDialog } from '@/components/GoogleOauthDialog/GoogleOauthDialog'
import { SiteProvider } from '@/components/SiteContext'
import { trpc, trpcClient } from '@/lib/trpc'
import { config } from '@/lib/wagmi/wagmiConfig'
import { StoreProvider } from '@/store'
import { Site } from '@penxio/types'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import {
  GetSiweMessageOptions,
  RainbowKitSiweNextAuthProvider,
} from '@rainbow-me/rainbowkit-siwe-next-auth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'
import { WagmiProvider } from 'wagmi'

const queryClient = new QueryClient()

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: 'Sign in with ethereum',
})

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
    <SessionProvider refetchInterval={0}>
      <SiteProvider site={site}>
        <Toaster className="dark:hidden" />
        <Toaster theme="dark" className="hidden dark:block" />
        <Suspense>
          <GoogleOauthDialog />
        </Suspense>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <RainbowKitSiweNextAuthProvider
                getSiweMessageOptions={getSiweMessageOptions}
              >
                <RainbowKitProvider>
                  <StoreProvider>{children}</StoreProvider>
                </RainbowKitProvider>
              </RainbowKitSiweNextAuthProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </trpc.Provider>
      </SiteProvider>
    </SessionProvider>
  )
}
