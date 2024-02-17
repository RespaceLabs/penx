import { useAccount, useWriteContract } from 'wagmi'
import { Button, toast } from 'uikit'
import { taskFacetAbi } from '@penx/abi'
import { addressMap } from '@penx/wagmi'

interface ClaimButtonProps {
  taskId: string
}

export function ClaimButton({ taskId }: ClaimButtonProps) {
  const { isConnected } = useAccount()
  const { writeContractAsync } = useWriteContract()
  return (
    <Button
      variant="outline"
      colorScheme="brand500"
      roundedFull
      border-2
      disabled={!isConnected}
      onClick={async () => {
        if (!isConnected) return

        console.log('=======taskId:', taskId)
        try {
          await writeContractAsync({
            address: addressMap.Diamond,
            abi: taskFacetAbi,
            functionName: 'createClaimReward',
            args: [taskId],
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
