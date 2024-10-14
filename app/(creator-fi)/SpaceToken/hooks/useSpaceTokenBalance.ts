import { useAddress } from '@/app/(creator-fi)/hooks/useAddress'
import { useSpace } from '@/app/(creator-fi)/hooks/useSpace'
import { spaceAbi } from '@/lib/abi'
import { Address } from 'viem'
import { useReadContract } from 'wagmi'

export const formatAmount = (value: string): string => {
  // Remove leading zeroes and limit decimals
  return value.replace(/^0+(\d)|(\.\d{18})\d+$/, '$1$2')
}

export function useSpaceTokenBalance() {
  const address = useAddress()
  const { space } = useSpace()
  return useReadContract({
    address: space.address as Address,
    abi: spaceAbi,
    functionName: 'balanceOf',
    args: [address!],
  })
}
