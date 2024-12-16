import { useSpaceContext } from '@/components/SpaceContext'
import { spaceAbi } from '@/lib/abi'
import { Address } from 'viem'
import { useReadContract } from 'wagmi'

export function useContributors() {
  const space = useSpaceContext()
  const { data: contributors = [], ...rest } = useReadContract({
    address: space.address as Address,
    abi: spaceAbi,
    functionName: 'getContributors',
    query: {
      enabled: !!space.address,
    },
  })

  return { contributors, ...rest }
}
