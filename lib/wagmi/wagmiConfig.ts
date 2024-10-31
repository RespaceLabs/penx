'use client'

import { createConfig } from '@privy-io/wagmi'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import {
  AppKitNetwork,
  base as reownBase,
  baseSepolia as reownBaseSepolia,
} from '@reown/appkit/networks'
import { cookieStorage, createStorage, http } from '@wagmi/core'
import { base, baseSepolia } from 'viem/chains'
import { NETWORK, NetworkNames, PROJECT_ID } from '../constants'

export function getReownChain() {
  if (NETWORK === NetworkNames.BASE_SEPOLIA) {
    return reownBaseSepolia
  }
  return reownBase
}

export function getChain() {
  if (NETWORK === NetworkNames.BASE_SEPOLIA) {
    return baseSepolia
  }
  return base
}

export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [getReownChain()]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId: PROJECT_ID,
  networks,
})

export const privyWagmiConfig = createConfig({
  chains: [getChain()],
  transports: {
    [getChain().id]: http(),
  } as any,
})

export const reownWagmiConfig = wagmiAdapter.wagmiConfig

export function getWagmiConfig(isPrivy: boolean) {
  return isPrivy ? privyWagmiConfig : reownWagmiConfig
}
