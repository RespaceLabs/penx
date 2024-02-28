import { useReadContract } from 'wagmi'
import { believerAbi, believerFacetAbi } from '@penx/abi'
import { BelieverNFT } from '@penx/model'
import { addressMap } from '@penx/wagmi'

export function useBelieverInfo() {
  console.log('==============addressMap.Diamond:', addressMap.Diamond)

  const { data, ...rest } = useReadContract({
    address: addressMap.Diamond,
    // address: addressMap.BelieverFacet,
    // address: addressMap.Believer,
    abi: believerFacetAbi,
    functionName: 'getTokenInfo',
  })

  return {
    ...rest,
    data: data ? new BelieverNFT(data) : null,
  }
}
