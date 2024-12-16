'use client'

import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { publicActions } from 'viem'
import { base, baseSepolia } from 'wagmi/chains'
import { NETWORK, NetworkNames, PROJECT_ID } from '../constants'

export function getChain() {
  if (NETWORK === NetworkNames.BASE_SEPOLIA) {
    return baseSepolia
  }
  return base
}

export const wagmiConfig = getDefaultConfig({
  appName: 'PenX',
  projectId: PROJECT_ID,
  chains: [getChain()],
  ssr: true,
})

export const publicClient = wagmiConfig.getClient().extend(publicActions)
