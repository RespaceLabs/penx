import { useSpaceContext } from '@/components/SpaceContext'
import { spaceAbi } from '@/lib/abi'
import { Address } from 'viem'
import { useReadContract } from 'wagmi'

export function useMembers() {
  const space = useSpaceContext()
  const { data: members = [], ...rest } = useReadContract({
    address: space.address as Address,
    abi: spaceAbi,
    functionName: 'getSubscriptions',
    query: {
      enabled: !!space.address,
    },
  })

  return { members, ...rest }
}
