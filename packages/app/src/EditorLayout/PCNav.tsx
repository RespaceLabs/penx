import { Box } from '@fower/react'
import { MoreHorizontal, Share2, Star } from 'lucide-react'
import { Button } from 'uikit'

export const PCNav = () => {
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
      <Box></Box>
      <Box>
        <Button size="sm" variant="ghost" colorScheme="gray500" isSquare>
          <Share2 />
        </Button>
        <Button size="sm" variant="ghost" colorScheme="gray500" isSquare>
          <Star />
        </Button>

        <Button size="sm" variant="ghost" colorScheme="gray500" isSquare>
          <MoreHorizontal />
        </Button>
      </Box>
    </Box>
  )
}
