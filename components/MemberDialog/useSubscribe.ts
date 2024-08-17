import { useAddress } from '@/hooks/useAddress'
import { refetchSpaces } from '@/hooks/useSpaces'
import { useSubscription } from '@/hooks/useSubscription'
import { spaceAbi } from '@/lib/abi'
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
  // const members = useMembers(!isBuy ? space.id : '')
  const { writeContractAsync } = useWriteContract()
  const searchParams = useSearchParams()
  const subscription = useSubscription()

  return async (token: string, amount: bigint, isSubscribe: boolean) => {
    console.log('==eth===amount:', amount)

    try {
      if (isSubscribe) {
        const hash = await writeContractAsync({
          address: space.spaceAddress as Address,
          abi: spaceAbi,
          functionName: 'subscribeByEth',
          args: [],
          value: amount,
        })

        await waitForTransactionReceipt(wagmiConfig, { hash })

        await Promise.all([
          subscription.refetch(),
          // buyPrice.refetch(),
          // supply.refetch(),
          // keyBalance.refetch(),
        ])
      } else {
        const hash = await writeContractAsync({
          address: space.spaceAddress as Address,
          abi: spaceAbi,
          functionName: 'unsubscribeByToken',
          args: [amount],
        })

        console.log('========amount:', amount)

        await waitForTransactionReceipt(wagmiConfig, { hash })

        // await api.trade.tradeSpaceKey.mutate({
        //   spaceId: space.id,
        //   holdAmount: balance.toString(),
        //   tradeAmount: amount.toString(),
        //   price: priceAfterFee.toString(),
        //   type: TradeType.BUY,
        // })

        await Promise.all([
          subscription.refetch(),
          // buyPrice.refetch(),
          // supply.refetch(),
          // keyBalance.refetch(),
          // members.refetch(),
          // refetchSpaces(),
        ])
      }

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
