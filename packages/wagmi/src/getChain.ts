import { Chain } from 'viem'
import { arbitrumSepolia, hardhat, mainnet, sepolia } from 'wagmi/chains'
import { NETWORK, NetworkNames, RPC_URL_MAP } from '@penx/constants'
import { addressMap } from './address'

export function getChain(): Chain {
  const RPC_URL = RPC_URL_MAP[NETWORK]

  // return sepolia
  if (NETWORK === NetworkNames.SEPOLIA) {
    return {
      ...arbitrumSepolia,
      rpcUrls: {
        default: {
          ...arbitrumSepolia.rpcUrls.default,
          http: [RPC_URL],
        },
      },
    }
  }

  // console.log('=========hardhat:', hardhat)

  // return hardhat
  const devHardhat: Chain = {
    ...hardhat,
    rpcUrls: {
      default: { http: [RPC_URL] },
    },
    contracts: {
      multicall3: {
        address: addressMap.Multicall3,
      },
    },
  }
  return devHardhat
}
