'use client'

import React, { ReactNode } from 'react'
import { wagmiConfig } from '@/lib/wagmi/wagmiConfig'
import { WagmiProvider } from '@privy-io/wagmi'
import { Config, cookieToInitialState, State } from 'wagmi'

const metadata = {
  name: 'Plantree',
  description: 'The best way to build web3 independent blog.',
  url: 'https://plantree.xyz', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
}

// Create the modal

export function PrivyWagmiProvider({
  children,
  cookies,
}: {
  children: ReactNode
  cookies: string | null
}) {
  const initialState = cookieToInitialState(wagmiConfig, cookies)

  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      {children}
    </WagmiProvider>
  )
}
