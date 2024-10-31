'use client'

import React, { ReactNode } from 'react'
import { privyWagmiConfig } from '@/lib/wagmi'
import { WagmiProvider } from '@privy-io/wagmi'
import { cookieToInitialState } from 'wagmi'

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
