import { useAddress } from '@/hooks/useAddress'
import { useBuyPrice } from '@/hooks/useBuyPrice'
import { useCreation } from '@/hooks/useCreation'
import { useHolders } from '@/hooks/useHolders'
import { useKeyBalance } from '@/hooks/useKeyBalance'
import { useMembers } from '@/hooks/useMembers'
import { refetchSpaces } from '@/hooks/useSpaces'
import { useSupply } from '@/hooks/useSupply'
import { indieXAbi } from '@/lib/abi'
import { usdcAbi } from '@/lib/abi/indieX'
import { addressMap } from '@/lib/address'
import { INDIE_X_APP_ID } from '@/lib/constants'
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
import { isAddress, zeroAddress } from 'viem'
import { arbitrumSepolia } from 'viem/chains'
import { useWriteContract } from 'wagmi'

export function useBuyKey(space: RouterOutputs['space']['byId'], post?: Post) {
  const isPost = !!post
  const address = useAddress()
  const { creation } = useCreation()
  const buyPrice = useBuyPrice(creation.id)
  const supply = useSupply(creation.id)
  const keyBalance = useKeyBalance(creation.id)
  const members = useMembers(!isPost ? space.id : '')
  const holders = useHolders(isPost ? post.id : '')
  const { writeContractAsync } = useWriteContract()
  const searchParams = useSearchParams()
  const curator = searchParams.get('curator') as string

  return async (creationId: bigint) => {
    const amount = 1
    try {
      const { priceAfterFee } = await readContract(wagmiConfig, {
        address: addressMap.IndieX,
        abi: indieXAbi,
        functionName: 'getBuyPriceAfterFee',
        args: [creationId, amount, INDIE_X_APP_ID],
      })

      console.log('=======priceAfterFee:', priceAfterFee)

      const allowance = await readContract(wagmiConfig, {
        address: addressMap.USDC,
        abi: usdcAbi,
        functionName: 'allowance',
        args: [address, addressMap.IndieX],
      })

      if (allowance < priceAfterFee) {
        const approveHash = await writeContract(wagmiConfig, {
          address: addressMap.USDC,
          abi: usdcAbi,
          functionName: 'approve',
          args: [addressMap.IndieX, priceAfterFee],
        })

        await waitForTransactionReceipt(wagmiConfig, { hash: approveHash })
      }

      const hash = await writeContractAsync({
        chain: arbitrumSepolia,
        address: addressMap.IndieX,
        abi: indieXAbi,
        functionName: 'buy',
        args: [creationId, amount, isAddress(curator) ? curator : zeroAddress],
        value: priceAfterFee,
      })

      await waitForTransactionReceipt(wagmiConfig, { hash })

      const balance = await readContract(wagmiConfig, {
        address: addressMap.IndieX,
        abi: indieXAbi,
        functionName: 'balanceOf',
        args: [address!, creationId],
      })

      if (isPost) {
        await api.trade.tradePostKey.mutate({
          postId: post.id,
          holdAmount: balance.toString(),
          tradeAmount: amount.toString(),
          price: priceAfterFee.toString(),
          type: 'BUY',
        })

        await Promise.all([
          buyPrice.refetch(),
          supply.refetch(),
          keyBalance.refetch(),
          holders.refetch(),
        ])
      } else {
        await api.trade.tradeSpaceKey.mutate({
          spaceId: space.id,
          holdAmount: balance.toString(),
          tradeAmount: amount.toString(),
          price: priceAfterFee.toString(),
          type: 'BUY',
        })

        await Promise.all([
          buyPrice.refetch(),
          supply.refetch(),
          keyBalance.refetch(),
          members.refetch(),
          refetchSpaces(),
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
