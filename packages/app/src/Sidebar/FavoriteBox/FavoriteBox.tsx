import { Box } from '@fower/react'
import { MoreHorizontal } from 'lucide-react'
import { Button } from 'uikit'
import { useNodes, useSpaces } from '@penx/hooks'
import { NodeItem } from './NodeItem'

export const FavoriteBox = () => {
  const { nodeList } = useNodes()
  const { activeSpace } = useSpaces()

  return (
    <Box gray600 p3 rounded2XL>
      <Box toCenterY toBetween gap2>
        <Box fontBold>Favorites</Box>
      </Box>
      <Box column>
        {nodeList.getFavorites(activeSpace.favorites).map((node) => (
          <NodeItem key={node.id} node={node} />
        ))}
      </Box>
    </Box>
  )
}
