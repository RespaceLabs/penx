import { precision } from '@/lib/math'
import { wagmiConfig } from '@/lib/wagmi'
import { waitForTransactionReceipt } from '@wagmi/core'
import { toast } from 'sonner'
import { useWriteContract } from 'wagmi'
import LoadingDots from '../icons/loading-dots'
import { Button } from '../ui/button'
import { useSpaceTokenBalance } from './hooks/useSpaceTokenBalance'
import { WalletConnectButton } from '../WalletConnectButton'
import { Space } from '@/app/~/space/[id]/hooks/useSpace'
import { Address } from 'viem'
import { spaceAbi } from '@/lib/abi/indieX'

interface Props {
  ethAmount: string;
  purchasedAmount: string;
  handleSwap: () => void;
  isInsufficientBalance: boolean;
  isAmountValid: boolean;
  isConnected: boolean;
  space: Space
}

export const SellBtn = ({
  ethAmount,
  purchasedAmount,
  isInsufficientBalance,
  isAmountValid,
  handleSwap,
  isConnected,
  space
}: Props) => {
  const { writeContractAsync, isPending } = useWriteContract()
  const balance = useSpaceTokenBalance()

  const onSell = async () => {
    const value = precision.token(parseFloat(purchasedAmount), 18)
    const hash = await writeContractAsync({
      address: space.spaceAddress as Address,
      abi: spaceAbi,
      functionName: 'sell',
      args: [value]
    })

    await waitForTransactionReceipt(wagmiConfig, { hash })
    await balance.refetch()
    handleSwap()
    toast.success(`${space?.name} sell successfully!`)
  }

  return (
    <>
      {isConnected ? <Button
        className="w-full h-[58px]"
        disabled={!isAmountValid || isInsufficientBalance || isPending}
        onClick={() => onSell()}
      >
        {isPending || balance.isPending ? (
          <LoadingDots color="white" />
        ) : (
          isInsufficientBalance
            ? 'Insufficient ETH balance'
            : isAmountValid
              ? 'Sell'
              : 'Enter an amount'
        )}
      </Button> :
        <WalletConnectButton className="w-full h-[58px]">
          Connect wallet
        </WalletConnectButton>}
    </>
  )
}
