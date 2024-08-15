import { useAddress } from '@/hooks/useAddress'
import { useSpaces } from '@/hooks/useSpaces'
import { spaceAbi } from '@/lib/abi/indieX'
import { Address } from 'viem'
import { useReadContract } from 'wagmi'

export function useSpaceTokenBalance() {
  const address = useAddress()
  const { space } = useSpaces()
  return useReadContract({
    address: space.spaceAddress as Address,
    abi: spaceAbi,
    functionName: 'balanceOf',
    args: [address!],
  })
}
