import { believerFacetAbi } from '@penx/abi'
import { BelieverNFT } from '@penx/model'
import { addressMap, useReadContract } from '@penx/wagmi'

export function useBelieverInfo() {
  const { data, ...rest } = useReadContract({
    address: addressMap.Diamond,
    abi: believerFacetAbi,
    functionName: 'getTokenInfo',
  })
  return {
    ...rest,
    data: data ? new BelieverNFT(data) : null,
  }
}
