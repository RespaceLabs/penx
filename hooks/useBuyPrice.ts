import { indieXAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { INDIE_X_APP_ID } from '@/lib/constants'
import { useReadContract } from 'wagmi'

export function useBuyPrice(creationId: bigint) {
  return useReadContract({
    address: addressMap.IndieX,
    abi: indieXAbi,
    functionName: 'getBuyPriceAfterFee',
    args: [creationId, 1, INDIE_X_APP_ID],
  })
}
