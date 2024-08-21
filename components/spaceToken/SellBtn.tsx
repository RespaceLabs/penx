import { useState } from 'react'
import { useEthBalance, useQueryEthBalance } from '@/hooks/useEthBalance'
import { useTrades } from '@/hooks/useTrades'
import { erc20Abi, spaceAbi } from '@/lib/abi'
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
  handleSwap: () => void
  isInsufficientBalance: boolean
  isAmountValid: boolean
  isConnected: boolean
  space: Space
}

export const SellBtn = ({
  ethAmount,
  tokenAmount,
  isInsufficientBalance,
  isAmountValid,
  handleSwap,
  isConnected,
  space,
}: Props) => {
  const [loading, setLoading] = useState(false)
  const { writeContractAsync } = useWriteContract()
  const balance = useSpaceTokenBalance()
  const { refetch: refetchEth } = useQueryEthBalance()
  const trade = useTrades()

  const onSell = async () => {
    setLoading(true)
    try {
      const value = precision.toExactDecimalBigint(tokenAmount)
      const contractAddress = space.spaceAddress as Address
      const approveTx = await writeContractAsync({
        address: contractAddress,
        abi: erc20Abi,
        functionName: 'approve',
        args: [contractAddress, value],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash: approveTx })

      const hash = await writeContractAsync({
        address: contractAddress,
        abi: spaceAbi,
        functionName: 'sell',
        args: [value],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash })

      await Promise.all([
        api.trade.create.mutate({
          spaceId: space.id,
          type: TradeType.SELL,
          amountIn: String(value),
          amountOut: precision.token(ethAmount).toString(),
        }),
        balance.refetch(),
        refetchEth(),
      ])
      trade.refetch()
      handleSwap()
      toast.success(`${space?.name} sell successfully!`)
    } catch (error) {
      toast.error(extractErrorMessage(error) || 'sell error')
    }
    setLoading(false)
  }

  return (
    <>
      {isConnected ? (
        <Button
          className="w-full h-[50px]"
          disabled={!isAmountValid || isInsufficientBalance || loading}
          onClick={() => onSell()}
        >
          {loading ? (
            <LoadingDots color="white" />
          ) : isInsufficientBalance ? (
            `Insufficient ${space.symbolName} balance`
          ) : isAmountValid ? (
            'Sell'
          ) : (
            'Enter an amount'
          )}
        </Button>
      ) : (
        <WalletConnectButton className="w-full h-[50px]">
          Connect wallet
        </WalletConnectButton>
      )}
    </>
  )
}
