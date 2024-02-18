import { useAccount, useWriteContract } from 'wagmi'
import { Button, toast } from 'uikit'
import { taskFacetAbi } from '@penx/abi'
import { addressMap } from '@penx/wagmi'

interface ClaimButtonProps {
  bountyId: string
}

export function ClaimButton({ bountyId }: ClaimButtonProps) {
  const { writeContractAsync } = useWriteContract()
  return (
    <Button
      size={48}
      colorScheme="brand500"
      roundedFull
      onClick={async () => {
        console.log('=======bountyId:', bountyId)
        try {
          await writeContractAsync({
            address: addressMap.Diamond,
            abi: taskFacetAbi,
            functionName: 'createClaimReward',
            args: [bountyId],
          })
        } catch (error) {
          toast.error((error as any)?.shortMessage)
        }
      }}
    >
      Claim rewards
    </Button>
  )
}
