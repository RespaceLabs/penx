import { Box } from '@fower/react'
import { ExtensionDetail } from './ExtensionDetail'
import { useQueryExtensions } from './hooks/useInstalledExtension'
import { MarketplaceSidebar } from './MarketplaceSidebar'

export function Marketplace() {
  const { isLoading } = useQueryExtensions()
  if (isLoading) return null

  return (
    <Box toLeft flex-1>
      <MarketplaceSidebar />
      <ExtensionDetail />
    </Box>
  )
}
