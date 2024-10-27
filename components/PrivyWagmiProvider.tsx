'use client'

import React, { ReactNode } from 'react'
import { privyWagmiConfig } from '@/lib/wagmi'
import { WagmiProvider } from '@privy-io/wagmi'
import { cookieToInitialState } from 'wagmi'

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
  const initialState = cookieToInitialState(privyWagmiConfig, cookies)

  return (
    <WagmiProvider config={privyWagmiConfig} initialState={initialState}>
      {children}
    </WagmiProvider>
  )
}
