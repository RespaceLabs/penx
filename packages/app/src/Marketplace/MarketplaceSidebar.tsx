import { Box } from '@fower/react'
import { Tab, Tabs } from 'uikit'
import { ExtensionList } from './ExtensionList'

export function MarketplaceSidebar() {
  return (
    <Box bgGray100 h-100p w-300>
      <Box toCenterY gap2 my3 textSM px3>
        <Box cursorPointer>Marketplace</Box>
        <Box cursorPointer>Installed</Box>
        <Box cursorPointer>Development</Box>
      </Box>
      <ExtensionList />
    </Box>
  )
}
