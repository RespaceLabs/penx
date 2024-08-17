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
import { spaceAbi } from '@/lib/abi'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { erc20Abi } from '@/lib/abi'

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
    try {
      const value = precision.toExactDecimalBigint(purchasedAmount)
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
        args: [value]
      })

      await waitForTransactionReceipt(wagmiConfig, { hash })
      await balance.refetch()
      handleSwap()
      toast.success(`${space?.name} sell successfully!`)
    } catch (error) {
      const msg = extractErrorMessage(error)
      console.log('%c=error', 'color:red', error, 'msg', msg)
      toast.error(msg)
    }
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
            ? `Insufficient ${space.name} balance`
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
