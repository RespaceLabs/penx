import { useAddress } from '@/hooks/useAddress'
import { useBuyPrice } from '@/hooks/useBuyPrice'
import { useCreation } from '@/hooks/useCreation'
import { useKeyBalance } from '@/hooks/useKeyBalance'
import { useSupply } from '@/hooks/useSupply'
import { indieXAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { revalidateMetadata } from '@/lib/revalidateTag'
import { api } from '@/lib/trpc'
import { wagmiConfig } from '@/lib/wagmi'
import { RouterOutputs } from '@/server/_app'
import { readContract, waitForTransactionReceipt } from '@wagmi/core'
import { toast } from 'sonner'
import { useWriteContract } from 'wagmi'

export function useSponsorSellKey(space: RouterOutputs['space']['byId']) {
  const address = useAddress()
  const { writeContractAsync } = useWriteContract()
  const { creation } = useCreation()
  const buyPrice = useBuyPrice(creation.id)
  const supply = useSupply(creation.id)
  const keyBalance = useKeyBalance(creation.id)

  return async (creationId: bigint) => {
    const amount = 1
    try {
      const hash = await writeContractAsync({
        address: addressMap.IndieX,
        abi: indieXAbi,
        functionName: 'sell',
        args: [creationId, amount],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash })

      const balance = await readContract(wagmiConfig, {
        address: addressMap.IndieX,
        abi: indieXAbi,
        functionName: 'balanceOf',
        args: [address!, creationId],
      })

      await api.trade.tradeSponsorKey.mutate({
        spaceId: space.id,
        holdAmount: balance.toString(),
        tradeAmount: amount.toString(),
        price: buyPrice!.data!.priceAfterFee.toString(),
        type: 'SELL',
      })

      await Promise.all([
        buyPrice.refetch(),
        supply.refetch(),
        keyBalance.refetch(),
      ])

      revalidateMetadata(`${space.subdomain}-sponsors-metadata`)

      toast.success('Sell Key successful!')
    } catch (error) {
      console.log('========error:', error)
      const msg = extractErrorMessage(error)
      toast.error(msg)
    } finally {
      //
    }
  }
}
