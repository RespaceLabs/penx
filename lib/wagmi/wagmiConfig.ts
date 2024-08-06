import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { cookieStorage, createStorage } from 'wagmi'
import {
  arbitrum,
  arbitrumSepolia,
  baseSepolia,
  mainnet,
  optimism,
  optimismSepolia,
  sepolia,
} from 'wagmi/chains'

// Get projectId from https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) throw new Error('Project ID is not defined')

const metadata = {
  name: 'IndieX',
  description: 'An incentive layer protocol designed for Indie X',
  url: 'https://www.indiex.xyz', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
}

// Create wagmiConfig
const chains = [
  // arbitrumSepolia,
  baseSepolia,
  // mainnet,
  // optimism,
  // arbitrum,
  // optimismSepolia,
] as const

export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  auth: {
    email: false,
    // socials: ['google', 'github', 'farcaster', 'x'],
    // showWallets: true,
    // walletFeatures: true,
  },
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
})
