import { indieXAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { useReadContract } from 'wagmi'

export function useSupply(creationId: bigint) {
  return useReadContract({
    address: addressMap.IndieX,
    abi: indieXAbi,
    functionName: 'creationSupply',
    args: [creationId],
  })
}
