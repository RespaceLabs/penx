import { Box } from '@fower/react'
import { useAtomValue } from 'jotai'
import { useDoc } from '@penx/hooks'
import { routerAtom } from '@penx/store'
import { FavoriteButton } from './FavoriteButton'
import { MorePopover } from './MorePopover'
import { NewDocButton } from './NewDocButton'
import { SharePopover } from './SharePopover'

export const PCNav = () => {
  const { doc } = useDoc()
  const { name } = useAtomValue(routerAtom)

  if (!doc.id) return null

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
      <Box pl2>{doc.title}</Box>
      <Box>
        <NewDocButton />
        <SharePopover />
        <FavoriteButton />

        <MorePopover />
      </Box>
    </Box>
  )
}
