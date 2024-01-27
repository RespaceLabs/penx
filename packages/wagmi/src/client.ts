import { createPublicClient, http } from 'viem'
import { getChain } from './getChain'

export const client = createPublicClient({
  chain: getChain(),
  transport: http(),
})
