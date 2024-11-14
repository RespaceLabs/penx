import { useSpaceContext } from '@/components/SpaceContext'
import { spaceAbi } from '@/lib/abi'
import { Address } from 'viem'
import { useReadContract } from 'wagmi'
import { useSpace } from './useSpace'

export type Vesting = {
  beneficiary: Address
  payer: Address
  start: bigint
  duration: bigint
  allocation: bigint
  released: bigint
}

export function useVestings() {
  const space = useSpaceContext()
  const { data: vestings = [], ...rest } = useReadContract({
    address: space.address as Address,
    abi: spaceAbi,
    functionName: 'getVestings',
    query: {
      enabled: !!space.address,
    },
  })

  return { vestings, ...rest }
}
