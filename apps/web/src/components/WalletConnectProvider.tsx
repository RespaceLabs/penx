import { PropsWithChildren } from 'react'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import {
  Chain,
  configureChains,
  createConfig,
  useAccount,
  WagmiConfig,
} from 'wagmi'
import { arbitrum, hardhat, mainnet, polygon, sepolia } from 'wagmi/chains'
import { ClientOnly } from './ClientOnly'

// const chains = [hardhat, arbitrum, mainnet, polygon, sepolia]
const chains = [mainnet, arbitrum, polygon, sepolia]

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
})

const ethereumClient = new EthereumClient(wagmiConfig, chains)

export function WalletConnectProvider({ children }: PropsWithChildren) {
  return (
    <ClientOnly>
      <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </ClientOnly>
  )
}
