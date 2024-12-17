import { Subscription } from '@/app/(creator-fi)/domains/Subscription'
import { useSpaceContext } from '@/components/SpaceContext'
import { spaceAbi } from '@/lib/abi'
import { Address } from 'viem'
import { useReadContract } from 'wagmi'
import { useSpace } from './useSpace'

export function useSubscriptions() {
  const space = useSpaceContext()
  const { data = [], ...rest } = useReadContract({
    address: space.address as Address,
    abi: spaceAbi,
    functionName: 'getSubscriptions',
  })
  const subscriptions = data.map((raw) => new Subscription(raw))
  return {
    ...rest,
    data,
    subscriptions,
    subscription: subscriptions?.[0] as Subscription,
  }
}
