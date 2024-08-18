import { useAddress } from '@/hooks/useAddress'
import { useMembers } from '@/hooks/useMembers'
import { refetchSpaces } from '@/hooks/useSpaces'
import { useSubscription } from '@/hooks/useSubscription'
import { spaceAbi } from '@/lib/abi'
import { TradeType } from '@/lib/constants'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { precision } from '@/lib/math'
import { api } from '@/lib/trpc'
import { wagmiConfig } from '@/lib/wagmi'
import { RouterOutputs } from '@/server/_app'
import { Post } from '@prisma/client'
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from '@wagmi/core'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Address, isAddress, zeroAddress } from 'viem'
import { useWriteContract } from 'wagmi'

export function useSubscribe(space: RouterOutputs['space']['byId']) {
  const members = useMembers(space.id)
  const { writeContractAsync } = useWriteContract()
  const address = useAddress()
  const subscription = useSubscription()

  return async (
    token: string,
    amount: bigint,
    isSubscribe: boolean,
    duration: number,
  ) => {
    const tradeType = isSubscribe ? TradeType.BUY : TradeType.SELL
    try {
      if (isSubscribe) {
        const hash = await writeContractAsync({
          address: space.spaceAddress as Address,
          abi: spaceAbi,
          functionName: 'subscribeByEth',
          value: amount,
        })

        await waitForTransactionReceipt(wagmiConfig, { hash })
      } else {
        const hash = await writeContractAsync({
          address: space.spaceAddress as Address,
          abi: spaceAbi,
          functionName: 'unsubscribeByToken',
          args: [amount],
        })

        console.log('========amount:', amount)

        await waitForTransactionReceipt(wagmiConfig, { hash })
      }

      const info = await readContract(wagmiConfig, {
        address: space.spaceAddress as Address,
        abi: spaceAbi,
        functionName: 'getSubscription',
        args: [address],
      })
      console.log('========subscription.info:', info)

      await api.trade.tradeSpaceKey.mutate({
        spaceId: space.id,
        tradeDuration: duration,
        start: Number(info.start),
        checkpoint: Number(info.checkpoint),
        duration: Number(info.duration),
        amount: String(info.amount),
        consumed: String(info.consumed),

        type: tradeType,
      })

      await Promise.all([
        subscription.refetch(),
        members.refetch(),
        refetchSpaces(),
      ])

      toast.success('Buy Key successful!')
    } catch (error) {
      console.log('=======>>>>error:', error)
      const msg = extractErrorMessage(error)
      toast.error(msg)
    } finally {
      //
    }
  }
}
