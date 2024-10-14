import { spaceAbi } from '@/lib/abi'
import { Address } from 'viem'
import { useReadContract } from 'wagmi'
import { useSpace } from './useSpace'

export function useContributors() {
  const { space } = useSpace()
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
