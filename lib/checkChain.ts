import { getAccount, getChains, switchChain } from '@wagmi/core'
import { getChain, wagmiConfig } from './wagmi'

export async function checkChain() {
  const account = getAccount(wagmiConfig)
  const chains = getChains(wagmiConfig)

  const isSupported = chains.some((chain) => chain.id === account.chainId)
  await switchChain(wagmiConfig, { chainId: getChain().id })
}
