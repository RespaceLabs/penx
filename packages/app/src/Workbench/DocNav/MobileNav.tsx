import { Box } from '@fower/react'
import { PaletteDrawer } from '../PaletteDrawer'
import { DrawerSidebar } from '../SidebarDrawer'
import { NewNodeButton } from './NewNodeButton'
import { QRScanner } from './QRScanner'

export const MobileNav = () => {
  return (
    <Box
      h-48
      sticky
      top0
      toCenterY
      toBetween
      px2
      display={['inline-flex', 'inline-flex', 'none']}
      w-100p
      flex-1
      zIndex-10
    >
      <DrawerSidebar />
      <Box toCenterY gap-2>
        <NewNodeButton />
        <PaletteDrawer />
      </Box>
    </Box>
  )
}
