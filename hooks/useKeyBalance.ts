import { indieXAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { useReadContract } from 'wagmi'
import { useAddress } from './useAddress'

export function useKeyBalance(creationId: bigint) {
  const address = useAddress()

  return useReadContract({
    address: addressMap.IndieX,
    abi: indieXAbi,
    functionName: 'balanceOf',
    args: [address, creationId],
  })
}
