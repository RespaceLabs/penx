import { Box } from '@fower/react'
import { PaletteDrawer } from '../PaletteDrawer'
import { NewNodeButton } from '../Sidebar/TreeView/NewNodeButton'
import { SidebarDrawer } from '../SidebarDrawer/SidebarDrawer'
import { QRScanner } from './QRScanner'

export const MobileNav = () => {
  return (
    <Box
      h-48
      sticky
      top0
      toCenterY
      toBetween
      bgWhite
      px2
      display={['inline-flex', 'inline-flex', 'none']}
      w-100p
      flex-1
      zIndex-10
    >
      <SidebarDrawer />
      <Box toCenterY gap-2>
        {/* <NewNodeButton /> */}
        <PaletteDrawer />
      </Box>
    </Box>
  )
}
