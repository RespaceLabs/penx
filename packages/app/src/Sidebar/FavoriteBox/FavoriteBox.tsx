import { Box } from '@fower/react'
import { MoreHorizontal } from 'lucide-react'
import { Button } from 'uikit'
import { useNodes, useSpaces } from '@penx/hooks'
import { DocItem } from './DocItem'

export const FavoriteBox = () => {
  const { nodeList } = useNodes()
  const { activeSpace } = useSpaces()

  return (
    <Box gray600 p3 rounded2XL>
      <Box toCenterY toBetween gap2>
        <Box fontBold>Favorites</Box>
        <Button
          size="sm"
          variant="ghost"
          colorScheme="gray700"
          isSquare
          roundedFull
        >
          <MoreHorizontal />
        </Button>
      </Box>
      <Box column>
        {nodeList.getFavorites(activeSpace.favorites).map((doc) => (
          <DocItem key={doc.id} node={doc} />
        ))}
      </Box>
    </Box>
  )
}
