import { believerAbi, believerFacetAbi } from '@penx/abi'
import { BelieverNFT } from '@penx/model'
import { addressMap, useReadContract } from '@penx/wagmi'

export function useBelieverInfo() {
  const { data, ...rest } = useReadContract({
    address: addressMap.Diamond,
    // address: addressMap.BelieverFacet,
    // address: addressMap.Believer,
    abi: believerFacetAbi,
    functionName: 'getTokenInfo',
  })

  console.log('============rest:', rest)

  return {
    ...rest,
    data: data ? new BelieverNFT(data) : null,
  }
}
