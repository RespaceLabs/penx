import { spaceAbi } from '@/lib/abi'
import { Address } from 'viem'
import { useReadContract } from 'wagmi'
import { useSpace } from './useSpace'

export function useShareOrders() {
  const { space } = useSpace()
  const { data: orders = [], ...rest } = useReadContract({
    address: space.address as Address,
    abi: spaceAbi,
    functionName: 'getShareOrders',
    query: {
      enabled: !!space.address,
    },
  })

  return { orders, ...rest }
}
