'use client'

import React, { ReactNode } from 'react'
import { networks, wagmiAdapter, wagmiConfig } from '@/lib/wagmi/wagmiConfig'
import { createAppKit } from '@reown/appkit/react'
import { Config, cookieToInitialState, State, WagmiProvider } from 'wagmi'

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string

const metadata = {
  name: 'Respace',
  description: 'Building Space On-Chain',
  url: 'https://www.respace.one', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
}

// Create the modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: networks,
  defaultNetwork: networks[0],
  metadata: metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
})

export function WalletConnectProvider({
  children,
  cookies,
}: {
  children: ReactNode
  cookies: string | null
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies,
  )

  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      {children}
    </WagmiProvider>
  )
}
