import { Box } from '@fower/react'
import { MarketplaceList } from './MarketplaceList'

export function Marketplace() {
  return (
    <Box
      minH="calc(100vh - 360px)"
      column
      gap8
      w={['100%', '100%', 760, 840, 1360]}
      pt20
    >
      <Box text3XL fontBold>
        Extensions for PenX
      </Box>
      <MarketplaceList />
    </Box>
  )
}
