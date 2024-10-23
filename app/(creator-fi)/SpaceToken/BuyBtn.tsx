import { useState } from 'react'
import { useQueryEthBalance } from '@/app/(creator-fi)/hooks/useEthBalance'
import { useSpace } from '@/app/(creator-fi)/hooks/useSpace'
import { useTrades } from '@/app/(creator-fi)/hooks/useTrades'
import LoadingDots from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { useAddress } from '@/hooks/useAddress'
import { spaceAbi } from '@/lib/abi'
import { checkChain } from '@/lib/checkChain'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { precision } from '@/lib/math'
import { wagmiConfig } from '@/lib/wagmi'
import { waitForTransactionReceipt } from '@wagmi/core'
import { toast } from 'sonner'
import { Address } from 'viem'
import { useWriteContract } from 'wagmi'
import { useSpaceTokenBalance } from './hooks/useSpaceTokenBalance'

interface Props {
  ethAmount: string
  tokenAmount: string
  afterSwap: () => void
  isInsufficientBalance: boolean
  isAmountValid: boolean
}

export const BuyBtn = ({
  ethAmount,
  tokenAmount,
  isInsufficientBalance,
  isAmountValid,
  afterSwap,
}: Props) => {
  const [loading, setLoading] = useState(false)
  const { writeContractAsync } = useWriteContract()
  const balance = useSpaceTokenBalance()
  const { refetch: refetchEth } = useQueryEthBalance()
  const address = useAddress()
  const { space } = useSpace()
  const trade = useTrades()

  const onBuy = async () => {
    setLoading(true)
    try {
      await checkChain()

      const value = precision.token(ethAmount)

      const hash = await writeContractAsync({
        address: space.address as Address,
        abi: spaceAbi,
        functionName: 'buy',
        args: [BigInt(0)],
        value,
      })

      console.log('=======tokenAmount:', tokenAmount)

      await waitForTransactionReceipt(wagmiConfig, { hash })
      await Promise.all([balance.refetch(), refetchEth()])

      trade.refetch()
      afterSwap()
      toast.success(`Bought ${space?.symbolName} successfully!`)
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
    setLoading(false)
  }

  if (!address)
    return (
      <WalletConnectButton className="h-[50px] w-full rounded-xl">
        Connect wallet
      </WalletConnectButton>
    )
  return (
    <Button
      className="h-[50px] w-full rounded-xl"
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
  )
}
