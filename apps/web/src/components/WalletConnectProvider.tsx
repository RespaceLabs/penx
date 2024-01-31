'use client'

import { PropsWithChildren, useEffect } from 'react'
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { getCookie, setCookie } from 'cookies-next'
import { createPublicClient, http } from 'viem'
import {
  Chain,
  configureChains,
  createConfig,
  useAccount,
  WagmiConfig,
} from 'wagmi'
import { arbitrum, hardhat, mainnet, polygon, sepolia } from 'wagmi/chains'
import { getChain } from '@penx/wagmi'
import { siweConfig } from './siweConfig'

const chains = [getChain()]

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
}

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

//
const modal = createWeb3Modal({
  // siweConfig: siweConfig,
  wagmiConfig,
  projectId,
  chains,
})

// const wagmiConfig = createConfig({
//   autoConnect: true,
//   connectors: w3mConnectors({ projectId, chains }),
//   publicClient,
// })

// const ethereumClient = new EthereumClient(wagmiConfig, chains)

const config = createConfig({
  // autoConnect: false,
  autoConnect: true,
  publicClient: createPublicClient({
    chain: getChain(),
    transport: http(),
  }),
})

export function WalletConnectProvider({ children }: PropsWithChildren) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>
}
