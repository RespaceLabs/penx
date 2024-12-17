import { NetworkNames } from '@/lib/constants'
import { createPublicClient, http } from 'viem'
import { base, baseSepolia } from 'viem/chains'

export function getBasePublicClient(network: string) {
  const baseClient = createPublicClient({
    chain: network === NetworkNames.BASE ? base : baseSepolia,
    transport: http(),
  })
  return baseClient
}
