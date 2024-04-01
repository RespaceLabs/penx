import { useAccount, useReadContract } from 'wagmi'
import { believerNftAbi } from '@penx/abi'
import { addressMap } from '@penx/wagmi'

export function useReferralCode() {
  const { address } = useAccount()
  return useReadContract({
    address: addressMap.BelieverNFT,
    abi: believerNftAbi,
    functionName: 'getReferralCode',
    args: [address!],
  })
}
