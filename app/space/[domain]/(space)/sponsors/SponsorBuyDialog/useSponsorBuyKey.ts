import { useAddress } from '@/hooks/useAddress'
import { useBuyPrice } from '@/hooks/useBuyPrice'
import { useCreation } from '@/hooks/useCreation'
import { useHolders } from '@/hooks/useHolders'
import { useKeyBalance } from '@/hooks/useKeyBalance'
import { useMembers } from '@/hooks/useMembers'
import { useSupply } from '@/hooks/useSupply'
import { indieXAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { INDIE_X_APP_ID } from '@/lib/constants'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { precision } from '@/lib/math'
import { revalidateMetadata } from '@/lib/revalidateTag'
import { api } from '@/lib/trpc'
import { wagmiConfig } from '@/lib/wagmi'
import { RouterOutputs } from '@/server/_app'
import { readContract, waitForTransactionReceipt } from '@wagmi/core'
import { toast } from 'sonner'
import { zeroAddress } from 'viem'
import { arbitrumSepolia } from 'viem/chains'
import { useWriteContract } from 'wagmi'

type Data = {
  name: string
  homeUrl: string
  logo: string
}

export function useSponsorBuyKey(space: RouterOutputs['space']['byId']) {
  const address = useAddress()
  const { creation } = useCreation()
  const buyPrice = useBuyPrice(creation.id)
  const supply = useSupply(creation.id)
  const keyBalance = useKeyBalance(creation.id)
  const { writeContractAsync } = useWriteContract()

  return async (creationId: bigint, data: Data) => {
    const amount = 1
    try {
      const { priceAfterFee } = await readContract(wagmiConfig, {
        address: addressMap.IndieX,
        abi: indieXAbi,
        functionName: 'getBuyPriceAfterFee',
        args: [creationId, amount, INDIE_X_APP_ID],
      })

      const hash = await writeContractAsync({
        chain: arbitrumSepolia,
        address: addressMap.IndieX,
        abi: indieXAbi,
        functionName: 'buy',
        args: [creationId, amount, zeroAddress],
        value: priceAfterFee,
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
        price: priceAfterFee.toString(),
        type: 'BUY',
        ...data,
      })

      await Promise.all([
        buyPrice.refetch(),
        supply.refetch(),
        keyBalance.refetch(),
      ])

      revalidateMetadata(`${space.subdomain}-sponsors-metadata`)

      toast.success('Buy Key successful!')
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg)
    } finally {
      //
    }
  }
}
