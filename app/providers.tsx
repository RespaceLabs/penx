'use client'

import { Suspense } from 'react'
import { Toaster } from 'sonner'
import { createSiweMessage } from 'viem/siwe'
import { WagmiProvider } from 'wagmi'
import { GoogleOauthDialog } from '@/components/GoogleOauthDialog/GoogleOauthDialog'
import { LoginDialog } from '@/components/LoginDialog/LoginDialog'
import { SiteProvider } from '@/components/SiteContext'
import { queryClient } from '@/lib/queryClient'
import { StoreProvider } from '@/lib/store'
import { trpc, trpcClient } from '@/lib/trpc'
import useSession from '@/lib/useSession'
import { wagmiConfig } from '@/lib/wagmi/wagmiConfig'
import {
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { signMessage } from '@wagmi/core'
import { RainbowKitSiweProvider } from './RainbowKitSiweProvider'

function RainbowProvider({ children }: { children: React.ReactNode }) {
  return (
    <RainbowKitSiweProvider>
      <RainbowKitProvider>
        <StoreProvider>
          <LoginDialog />
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
}: {
  children: React.ReactNode
  cookies?: string | null
}) {
  return (
    <>
      <Toaster className="dark:hidden" richColors />
      <Toaster theme="dark" className="hidden dark:block" richColors />
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowProvider>{children}</RainbowProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </trpc.Provider>
    </>
  )
}
