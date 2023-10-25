import { Box } from '@fower/react'
import { useNode } from '@penx/hooks'
import { Breadcrumb } from './Breadcrumb'
import { FavoriteButton } from './FavoriteButton'
import { MorePopover } from './MorePopover'
import { NewNodeButton } from './NewNodeButton'
import { SharePopover } from './SharePopover'

export const PCNav = () => {
  const { node } = useNode()

  if (!node?.id) return null

  return (
    <Box
      h-48
      sticky
      top0
      toCenterY
      toBetween
      px2
      display={['none', 'inline-flex', 'inline-flex']}
      w-100p
      bgWhite
      zIndex-10
    >
      <Breadcrumb />
      <Box>
        <NewNodeButton />
        <SharePopover />
        <FavoriteButton />
        <MorePopover />
      </Box>
    </Box>
  )
}
