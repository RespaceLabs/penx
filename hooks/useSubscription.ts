import { Subscription } from '@/domains/Subscription'
import { spaceAbi } from '@/lib/abi'
import { Address } from 'viem'
import { useReadContract } from 'wagmi'
import { useAddress } from './useAddress'
import { useSpaces } from './useSpaces'

export function useSubscription() {
  const { space } = useSpaces()
  const address = useAddress()
  const res = useReadContract({
    address: space.spaceAddress as Address,
    abi: spaceAbi,
    functionName: 'getSubscription',
    args: [address],
  })

  return {
    ...res,
    subscription:
      typeof res.data === 'undefined'
        ? (null as any as Subscription)
        : new Subscription(res.data!),
  }
}
