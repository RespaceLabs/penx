import { Box } from '@fower/react'
import { useContractWrite } from 'wagmi'
import { Button, Spinner, toast } from 'uikit'
import { believerFacetAbi } from '@penx/abi'
import { addressMap } from '@penx/wagmi'
import { useBelieverInfo } from './useBelieverInfo'

export function MintButton() {
  return null
  const { data: nft } = useBelieverInfo()
  const { writeAsync, isLoading, data, error, isError } = useContractWrite({
    address: addressMap.Diamond,
    abi: believerFacetAbi,
    functionName: 'mintBelieverNFT',
    value: nft!.currentPrice,
  })

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
          await writeAsync()
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
