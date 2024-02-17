import { Box } from '@fower/react'
import { useWriteContract } from 'wagmi'
import { Button, Spinner, toast } from 'uikit'
import { believerFacetAbi } from '@penx/abi'
import { addressMap } from '@penx/wagmi'
import { useBelieverInfo } from './useBelieverInfo'

export function MintButton() {
  return null
  const { data: nft } = useBelieverInfo()
  const { writeContractAsync, isLoading } = useWriteContract()

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
            address: addressMap.Diamond,
            abi: believerFacetAbi,
            functionName: 'mintBelieverNFT',
            value: nft!.currentPrice,
          })
        } catch (error: any) {
          toast.info(error.message)
        }
      }}
    >
      {isLoading && <Spinner white />}
      <Box>Mint Believer NFT</Box>
    </Button>
  )
}
