import { useAccount, useWriteContract } from 'wagmi'
import { Button, toast } from 'uikit'
import { bountyFacetAbi } from '@penx/abi'
import { addressMap } from '@penx/wagmi'

interface ClaimButtonProps {
  bountyId: string
  address: string
  status: string
}

export function ClaimButton({ bountyId, address, status }: ClaimButtonProps) {
  const { address: walletAddress } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const isClaimable = status === 'claimable'
  const isCompleted = status === 'completed'
  return (
    <Button
      size={48}
      colorScheme="brand500"
      roundedFull
      disabled={isCompleted}
      onClick={async () => {
        if (isCompleted) return
        console.log('=======bountyId:', bountyId, 'address:', address)

        if (!address) {
          toast.info('This bounty task has not been completed yet')
          return
        }

        if (address !== walletAddress) {
          toast.info('You can claim your own bounty task only')
          return
        }

        if (!isClaimable) {
          toast.info('Not claimable, please complete this task first')
          return
        }

        try {
          await writeContractAsync({
            address: addressMap.Diamond,
            abi: bountyFacetAbi,
            functionName: 'createClaimReward',
            args: [bountyId],
          })
        } catch (error) {
          toast.error((error as any)?.shortMessage)
        }
      }}
    >
      {isCompleted ? 'Completed and Claimed' : 'Claim rewards'}
    </Button>
  )
}
