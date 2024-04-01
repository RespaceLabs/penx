import { useReadContract } from 'wagmi'
import { believerNftAbi } from '@penx/abi'
import { BelieverNFT } from '@penx/model'
import { addressMap } from '@penx/wagmi'

export function useBelieverInfo() {
  const { data, ...rest } = useReadContract({
    address: addressMap.BelieverNFT,
    abi: believerNftAbi,
    functionName: 'getTokenInfo',
  })

  return {
    ...rest,
    data: data ? new BelieverNFT(data) : null,
  }
}
