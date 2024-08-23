import { useState } from 'react'
import { useQueryEthBalance } from '@/hooks/useEthBalance'
import { useTrades } from '@/hooks/useTrades'
import { spaceAbi } from '@/lib/abi'
import { checkChain } from '@/lib/checkChain'
import { TradeType } from '@/lib/constants'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { precision } from '@/lib/math'
import { api } from '@/lib/trpc'
import { wagmiConfig } from '@/lib/wagmi'
import { Space } from '@prisma/client'
import { waitForTransactionReceipt } from '@wagmi/core'
import { toast } from 'sonner'
import { Address } from 'viem'
import { useWriteContract } from 'wagmi'
import LoadingDots from '../icons/loading-dots'
import { Button } from '../ui/button'
import { WalletConnectButton } from '../WalletConnectButton'
import { useSpaceTokenBalance } from './hooks/useSpaceTokenBalance'

interface Props {
  ethAmount: string
  tokenAmount: string
  afterSwap: () => void
  isInsufficientBalance: boolean
  isAmountValid: boolean
  isConnected: boolean
  space: Space
}

export const BuyBtn = ({
  ethAmount,
  tokenAmount,
  isInsufficientBalance,
  isAmountValid,
  afterSwap,
  isConnected,
  space,
}: Props) => {
  const [loading, setLoading] = useState(false)
  const { writeContractAsync } = useWriteContract()
  const balance = useSpaceTokenBalance()
  const { refetch: refetchEth } = useQueryEthBalance()
  const trade = useTrades()

  const onBuy = async () => {
    setLoading(true)
    try {
      await checkChain()

      const value = precision.token(ethAmount)
      const hash = await writeContractAsync({
        address: space.spaceAddress as Address,
        abi: spaceAbi,
        functionName: 'buy',
        value,
      })

      await waitForTransactionReceipt(wagmiConfig, { hash })
      await Promise.all([
        api.trade.create.mutate({
          spaceId: space.id,
          type: TradeType.BUY,
          amountIn: String(value),
          amountOut: precision.token(tokenAmount).toString(),
        }),
        balance.refetch(),
        refetchEth(),
      ])

      trade.refetch()
      afterSwap()
      toast.success(`Bought ${space?.symbolName} successfully!`)
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
    setLoading(false)
  }

  return (
    <>
      {isConnected ? (
        <Button
          className="w-full h-[50px] rounded-xl"
          disabled={!isAmountValid || isInsufficientBalance || loading}
          onClick={() => onBuy()}
        >
          {loading ? (
            <LoadingDots color="white" />
          ) : isInsufficientBalance ? (
            'Insufficient ETH balance'
          ) : isAmountValid ? (
            'Buy'
          ) : (
            'Enter an amount'
          )}
        </Button>
      ) : (
        <WalletConnectButton className="w-full h-[50px] rounded-xl">
          Connect wallet
        </WalletConnectButton>
      )}
    </>
  )
}
