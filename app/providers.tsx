'use client'

import { PrivyWagmiProvider } from '@/components/PrivyWagmiProvider'
import { ReownWagmiProvider } from '@/components/ReownWagmiProvider'
import { SiteProvider } from '@/components/SiteContext'
import { trpc, trpcClient } from '@/lib/trpc'
import { StoreProvider } from '@/store'
import { Site } from '@plantreexyz/types'
import { AuthType } from '@prisma/client'
import { PrivyProvider } from '@privy-io/react-auth'
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
  const WagmiProvider =
    site.authType === AuthType.PRIVY ? PrivyWagmiProvider : ReownWagmiProvider

  const authConfig = site.authConfig as any
  return (
    <PrivyProvider
      appId={authConfig?.privyAppId || 'cm2m05e510d9rexwjez8j66gv'}
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          // logo: 'https://your-logo-url',
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <SessionProvider>
        <SiteProvider site={site}>
          <Toaster className="dark:hidden" />
          <Toaster theme="dark" className="hidden dark:block" />
          <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
              <ReownWagmiProvider cookies={cookies}>
                <PrivyWagmiProvider cookies={cookies}>
                  <StoreProvider>{children}</StoreProvider>
                </PrivyWagmiProvider>
              </ReownWagmiProvider>
            </QueryClientProvider>
          </trpc.Provider>
        </SiteProvider>
      </SessionProvider>
    </PrivyProvider>
  )
}
