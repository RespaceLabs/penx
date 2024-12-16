import { getAccount, getChains, switchChain } from '@wagmi/core'
import { useWagmiConfig } from './useWagmiConfig'

export function useCheckChain() {
  const wagmiConfig = useWagmiConfig()
  return async () => {
    const account = getAccount(wagmiConfig)
    const chains = getChains(wagmiConfig)
    const isSupported = chains.some((chain) => chain.id === account.chainId)

    if (!isSupported) {
      await switchChain(wagmiConfig, { chainId: chains[0].id })
    }
  }
}
