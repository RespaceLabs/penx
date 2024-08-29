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
import { NetworkNames } from '../constants'

// Get projectId from https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) throw new Error('Project ID is not defined')

const metadata = {
  name: 'PenX',
  description: 'The space for web3 creators',
  url: 'https://www.penx.io', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
}

const NETWORK = process.env.NEXT_PUBLIC_NETWORK as NetworkNames

export function getChain() {
  if (NETWORK === NetworkNames.ARB_SEPOLIA) {
    return {
      ...arbitrumSepolia,
      rpcUrls: {
        default: {
          http: [
            'https://arb-sepolia.g.alchemy.com/v2/HI5irVjoVHajk9VrB7FAkpt2Inz1iymo',
          ],
        },
      },
    }
  }
  if (NETWORK === NetworkNames.BASE_SEPOLIA) {
    return {
      ...baseSepolia,
      rpcUrls: {
        default: {
          http: [
            'https://base-sepolia.g.alchemy.com/v2/3NOJzJclAc6EPYa2uW4rBchMV5o6eAI0',
          ],
        },
      },
    }
  }
  return arbitrumSepolia
}

// Create wagmiConfig
const chains = [
  getChain(),
  // baseSepolia,
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
    // email: true,
    // socials: ['google', 'github', 'farcaster', 'x'],
    // socials: ['farcaster', 'google'],
    // showWallets: true,
    // walletFeatures: true,
  },
  ssr: false,
  storage: createStorage({
    storage: cookieStorage,
  }),
})
