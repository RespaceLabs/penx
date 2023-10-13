import { Box } from '@fower/react'
import { MoreHorizontal, Star } from 'lucide-react'
import { Button } from 'uikit'
import { useDoc } from '@penx/hooks'
import { MorePopover } from './MorePopover'
import { SharePopover } from './SharePopover'

export const PCNav = () => {
  const doc = useDoc()

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
        <SharePopover />
        <Button size="sm" variant="ghost" colorScheme="gray500" isSquare>
          <Star />
        </Button>

        <MorePopover />
      </Box>
    </Box>
  )
}
