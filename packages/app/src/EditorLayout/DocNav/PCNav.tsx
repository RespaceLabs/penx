import { Box } from '@fower/react'
import { usePage } from '@penx/hooks'
import { FavoriteButton } from './FavoriteButton'
import { MorePopover } from './MorePopover'
import { NewDocButton } from './NewDocButton'
import { SharePopover } from './SharePopover'

export const PCNav = () => {
  const { page } = usePage()

  if (!page?.id) return null

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
      <Box pl2>{page.node.id}</Box>
      <Box>
        <NewDocButton />
        <SharePopover />
        <FavoriteButton />
        <MorePopover />
      </Box>
    </Box>
  )
}
