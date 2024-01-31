import { Chain } from 'viem'
import { hardhat, mainnet } from 'wagmi/chains'
import { NETWORK, NetworkNames } from '@penx/constants'
import { addressMap } from './address'

export const DEVELOP_RPC_URL = process.env.NEXT_PUBLIC_DEVELOP_RPC_URL as string

export function getChain(): Chain {
  const devHardhat: Chain = {
    ...hardhat,
    rpcUrls: {
      default: { http: [DEVELOP_RPC_URL] },
      public: { http: [DEVELOP_RPC_URL] },
    },
    contracts: {
      multicall3: {
        address: addressMap.Multicall3,
      },
    },
  }
  return devHardhat
}
