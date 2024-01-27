import { Box } from '@fower/react'
import { Button, Spinner } from 'uikit'
import { believerFacetAbi } from '@penx/abi'
import { addressMap, useWriteContract } from '@penx/wagmi'
import { useBelieverInfo } from './useBelieverInfo'

export function MintButton() {
  const { data: nft } = useBelieverInfo()
  const { writeContract, isLoading, data, error, isError } = useWriteContract()

  return (
    <Button
      size={56}
      w-300
      gap2
      roundedFull
      colorScheme="cyan500"
      disabled={isLoading}
      onClick={async () => {
        writeContract({
          address: addressMap.Diamond,
          abi: believerFacetAbi,
          functionName: 'mintBelieverNFT',
          value: nft!.currentPrice,
        })
      }}
    >
      {isLoading && <Spinner white />}
      <Box>Mint Believer NFT</Box>
    </Button>
  )
}
