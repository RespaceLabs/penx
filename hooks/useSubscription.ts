import { Subscription } from '@/domains/Subscription'
import { spaceAbi } from '@/lib/abi'
import { Address } from 'viem'
import { useReadContract } from 'wagmi'
import { useAddress } from './useAddress'
import { useSpace } from './useSpace'

export function useSubscription() {
  const { space } = useSpace()
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
