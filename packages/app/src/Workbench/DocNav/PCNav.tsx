import { Box } from '@fower/react'
import { useNodeContext } from '@penx/hooks'
import { PaletteDrawer } from '../PaletteDrawer'
import { Breadcrumb } from './Breadcrumb'
import { ClosePanelButton } from './ClosePanelButton'
import { FavoriteButton } from './FavoriteButton'
import { MorePopover } from './MorePopover'
import { NewNodeButton } from './NewNodeButton'
import { SharePopover } from './SharePopover'

export const PCNav = () => {
  const { node } = useNodeContext()

  return (
    <Box
      h-48
      sticky
      top0
      toCenterY
      toBetween
      px2
      display={['none', 'none', 'inline-flex']}
      w-100p
      bgWhite
      zIndex-10
    >
      <Breadcrumb />
      <Box>
        <NewNodeButton />
        {/* <SharePopover /> */}
        <FavoriteButton />
        <ClosePanelButton />
        <MorePopover />
      </Box>
    </Box>
  )
}
