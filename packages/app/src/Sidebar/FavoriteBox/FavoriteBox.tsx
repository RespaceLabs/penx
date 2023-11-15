import { Box } from '@fower/react'
import { useNodes, useSpaces } from '@penx/hooks'
import { NodeItem } from './NodeItem'

export const FavoriteBox = () => {
  const { nodeList } = useNodes()
  const { activeSpace } = useSpaces()

  return (
    <Box>
      <Box toCenterY gap2 px2 gray600 mb2 mt2>
        <Box fontBold>FAVORITES</Box>
      </Box>
      <Box column>
        {nodeList.getFavorites(activeSpace.favorites).map((node) => (
          <NodeItem key={node.id} node={node} />
        ))}
      </Box>
    </Box>
  )
}
