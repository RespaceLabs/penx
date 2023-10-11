import { Box } from '@fower/react'
import { MoreHorizontal, Share2, Star } from 'lucide-react'
import { Button } from 'uikit'
import { useDoc } from '@penx/hooks'

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
