import { useAccount, useWriteContract } from 'wagmi'
import { Button, toast } from 'uikit'
import { bountyFacetAbi } from '@penx/abi'
import { addressMap } from '@penx/wagmi'

interface ClaimButtonProps {
  bountyId: string
  address: string
}

export function ClaimButton({ bountyId, address }: ClaimButtonProps) {
  const { address: walletAddress } = useAccount()
  const { writeContractAsync } = useWriteContract()
  return (
    <Button
      size={48}
      colorScheme="brand500"
      roundedFull
      // disabled={!address}
      onClick={async () => {
        console.log('=======bountyId:', bountyId, 'address:', address)

        if (!address) {
          toast.info('This bounty task has not been completed yet')
          return
        }

        if (address !== walletAddress) {
          toast.info('You can claim your own bounty task only')
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
      Claim rewards
    </Button>
  )
}
