import { writeContract } from '@wagmi/core'
import { useAccount } from 'wagmi'
import { Button, toast } from 'uikit'
import { taskFacetAbi } from '@penx/abi'
import { addressMap } from '@penx/wagmi'

interface ClaimButtonProps {
  taskId: string
}

export function ClaimButton({ taskId }: ClaimButtonProps) {
  const { isConnected } = useAccount()
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
          await writeContract({
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
