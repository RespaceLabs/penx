import { Box } from '@fower/react'
import { useRouter } from 'next/router'
import { useWriteContract } from 'wagmi'
import { Button, Spinner, toast } from 'uikit'
import { believerNftAbi } from '@penx/abi'
import { addressMap } from '@penx/wagmi'
import { useBelieverInfo } from './useBelieverInfo'

export function MintButton() {
  const { data: nft } = useBelieverInfo()
  const { writeContractAsync, isLoading } = useWriteContract()
  const { query } = useRouter()

  return (
    <Button
      size={56}
      w-300
      gap2
      roundedFull
      colorScheme="cyan500"
      disabled={isLoading}
      onClick={async () => {
        try {
          await writeContractAsync({
            address: addressMap.BelieverNFT,
            abi: believerNftAbi,
            functionName: 'mintNFT',
            args: [(query.ref as string) || ''],
            value: nft!.currentPrice,
          })
          toast.success('Mint Believer NFT successfully!')
        } catch (error: any) {
          toast.info(error.shortMessage || error.message)
        }
      }}
    >
      {isLoading && <Spinner white />}
      <Box>Mint Believer NFT</Box>
    </Button>
  )
}
