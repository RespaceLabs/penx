import { Box } from '@fower/react'
import { useBelieverInfo } from './useBelieverInfo'

export function NFTBasicInfo() {
  const { data: nft } = useBelieverInfo()

  if (!nft) return null

  return (
    <Box toCenterY gap3>
      <Box text3XL>
        {nft.currentSupplyDecimal}/{nft.maxSupplyDecimal}
      </Box>
      {!!nft && <Box>{nft.currentPriceDecimal}ETH</Box>}
    </Box>
  )
}
