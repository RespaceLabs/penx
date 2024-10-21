'use client'

import React, { ReactNode } from 'react'
import { PROJECT_ID } from '@/lib/constants'
import { siweConfig } from '@/lib/wagmi/siweConfig'
import { networks, wagmiAdapter, wagmiConfig } from '@/lib/wagmi/wagmiConfig'
import { createAppKit } from '@reown/appkit/react'
import { Config, cookieToInitialState, State, WagmiProvider } from 'wagmi'

const metadata = {
  name: 'Plantree',
  description: 'The best way to build web3 independent blog.',
  url: 'https://plantree.xyz', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
}

// Create the modal
const modal = createAppKit({
  siweConfig: siweConfig,
  adapters: [wagmiAdapter],
  projectId: PROJECT_ID,
  networks: networks,
  defaultNetwork: networks[0],
  metadata: metadata,
  showWallets: true,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    email: false,
    socials: false,
    allWallets: true,
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
