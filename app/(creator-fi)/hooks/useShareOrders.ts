import { useSpaceContext } from '@/components/SpaceContext'
import { spaceAbi } from '@/lib/abi'
import { Address } from 'viem'
import { useReadContract } from 'wagmi'

export function useShareOrders() {
  const space = useSpaceContext()
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
