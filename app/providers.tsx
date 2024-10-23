'use client'

import { PrivyWagmiProvider } from '@/components/PrivyWagmiProvider'
import { ReownWagmiProvider } from '@/components/ReownWagmiProvider'
import { isPrivy } from '@/lib/constants'
import { trpc, trpcClient } from '@/lib/trpc'
import { StoreProvider } from '@/store'
import { PrivyProvider } from '@privy-io/react-auth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'

const queryClient = new QueryClient()

export function Providers({
  children,
  cookies,
}: {
  children: React.ReactNode
  cookies: string | null
}) {
  const WagmiProvider = isPrivy ? PrivyWagmiProvider : ReownWagmiProvider

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
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
        <Toaster className="dark:hidden" />
        <Toaster theme="dark" className="hidden dark:block" />
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <WagmiProvider cookies={cookies}>
              <StoreProvider>{children}</StoreProvider>
            </WagmiProvider>
          </QueryClientProvider>
        </trpc.Provider>
      </SessionProvider>
    </PrivyProvider>
  )
}
