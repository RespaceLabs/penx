import React, { ReactNode } from 'react'
// import { config, projectId } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createWeb3Modal, Web3ModalOptions } from '@web3modal/wagmi/react'
import { State, WagmiProvider } from 'wagmi'
import { isServer } from '@penx/constants'
import { projectId, wagmiConfig } from '@penx/wagmi'
import { siweConfig } from './siweConfig'

// Setup queryClient
const queryClient = new QueryClient()

if (!projectId) throw new Error('Project ID is not defined')

const config: Web3ModalOptions<any> = {
  wagmiConfig: wagmiConfig,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
}

// if (!isServer) {
//   if (location.pathname.includes('/login/web3')) {
//     config.siweConfig = siweConfig
//   }
// }

// Create modal
createWeb3Modal(config)

export function WalletConnectProvider({
  children,
  initialState,
}: {
  children: ReactNode
  initialState?: State
}) {
  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
