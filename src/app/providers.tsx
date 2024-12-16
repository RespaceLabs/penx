'use client'

import { Suspense } from 'react'
import { GoogleOauthDialog } from '@/components/GoogleOauthDialog/GoogleOauthDialog'
import { SiteProvider } from '@/components/SiteContext'
import { queryClient } from '@/lib/queryClient'
import { trpc, trpcClient } from '@/lib/trpc'
import useSession from '@/lib/useSession'
import { wagmiConfig } from '@/lib/wagmi/wagmiConfig'
import { StoreProvider } from '@/store'
import { Site } from '@penxio/types'
import {
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { signMessage } from '@wagmi/core'
import { Toaster } from 'sonner'
import { createSiweMessage } from 'viem/siwe'
import { WagmiProvider } from 'wagmi'
import { RainbowKitSiweProvider } from './RainbowKitSiweProvider'

function RainbowProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession()

  return (
    <RainbowKitSiweProvider>
      <RainbowKitProvider>
        <StoreProvider>
          <GoogleOauthDialog />
          {children}
        </StoreProvider>
      </RainbowKitProvider>
    </RainbowKitSiweProvider>
  )
}

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
    <SiteProvider site={site}>
      <Toaster className="dark:hidden" richColors />
      <Toaster theme="dark" className="hidden dark:block" richColors />
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowProvider>{children}</RainbowProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </trpc.Provider>
    </SiteProvider>
  )
}
