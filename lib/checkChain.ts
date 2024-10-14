import { getAccount, getChains, switchChain } from '@wagmi/core'
import { networks, wagmiConfig } from './wagmi'

export async function checkChain() {
  const account = getAccount(wagmiConfig)
  const chains = getChains(wagmiConfig)
  const isSupported = chains.some((chain) => chain.id === account.chainId)

  if (!isSupported) {
    await switchChain(wagmiConfig, { chainId: chains[0].id })
  }
}
