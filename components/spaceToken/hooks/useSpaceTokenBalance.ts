import { useAddress } from '@/hooks/useAddress'
import { useSpace } from '@/hooks/useSpace'
import { spaceAbi } from '@/lib/abi'
import { Address } from 'viem'
import { useReadContract } from 'wagmi'

export function useSpaceTokenBalance() {
  const address = useAddress()
  const { space } = useSpace()
  return useReadContract({
    address: space.spaceAddress as Address,
    abi: spaceAbi,
    functionName: 'balanceOf',
    args: [address!],
  })
}
