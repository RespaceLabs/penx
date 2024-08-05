import { remirrorTokenAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { precision } from '@/lib/math'
import { wagmiConfig } from '@/lib/wagmi'
import { readContract, waitForTransactionReceipt } from '@wagmi/core'
import { toast } from 'sonner'
import { useWriteContract } from 'wagmi'
import LoadingDots from '../icons/loading-dots'
import { Button } from '../ui/button'
import { useRemirrorBalance } from './hooks/useRemirrorBalance'
import { WalletConnectButton } from '../WalletConnectButton'

interface BuyTokenButtonProps {
  ethAmount: string;
  purchasedAmount: string;
  handleSwap: () => void;
  isInsufficientBalance: boolean;
  isAmountValid: boolean;
  isConnected: boolean;
}

export const BuyTokenButton = ({
  ethAmount,
  purchasedAmount,
  isInsufficientBalance,
  isAmountValid,
  handleSwap,
  isConnected
}: BuyTokenButtonProps) => {
  const { writeContractAsync, isPending } = useWriteContract()
  const balance = useRemirrorBalance()

  const onBuy = async () => {
    const value = precision.token(parseFloat(ethAmount), 18)
    const hash = await writeContractAsync({
      address: addressMap.RemirrorToken,
      abi: remirrorTokenAbi,
      functionName: 'mint',
      // value: precision.token(0.02233232, 18),
      value
    })

    const amount = readContract(wagmiConfig, {
      address: addressMap.RemirrorToken,
      abi: remirrorTokenAbi,
      functionName: 'getTokenAmount',
      // args: [precision.token(0.02233232, 18),]
      args: [value,]
    })

    await waitForTransactionReceipt(wagmiConfig, { hash })
    await balance.refetch()
    handleSwap()
    toast.success('Remirror bought successfully!')
  }

  return (
    <>
    {isConnected ?<Button
      className="w-full h-[58px]"
      disabled={!isAmountValid || isInsufficientBalance || isPending}
      onClick={() => onBuy()}
    >
      {isPending || balance.isPending ? (
        <LoadingDots color="white" />
      ) : (
        isInsufficientBalance
          ? 'Insufficient ETH balance'
          : isAmountValid
            ? 'Swap'
            : 'Enter an amount'
      )}
    </Button>: 
    <WalletConnectButton className="w-full h-[58px]">
      Connect wallet
    </WalletConnectButton>}
    </>
  )
}
