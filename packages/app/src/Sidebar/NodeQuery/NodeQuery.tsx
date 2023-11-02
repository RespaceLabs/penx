import { Box } from '@fower/react'
import { MoreHorizontal } from 'lucide-react'
import { Button } from 'uikit'
import { useNodes, useSpaces } from '@penx/hooks'
import { SqlParser } from '../SqlParser'
import { NodeItem } from './NodeItem'

interface Props {
  sql: string
  title: string
}

export const NodeQuery = ({ sql, title }: Props) => {
  const { nodeList } = useNodes()
  const { activeSpace } = useSpaces()
  const parsed = new SqlParser(sql)

  // const nodes = nodeList.find({
  //   where: {
  //     spaceId: activeSpace.id,
  //   },
  //   ...parsed.queryParams,
  // })
  const nodes = nodeList.rootNodes

  return (
    <Box gray600 px3 py1 rounded2XL mb3>
      <Box toCenterY toBetween gap2>
        <Box fontBold>{title}</Box>
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
        {nodes.map((node) => (
          <NodeItem key={node.id} node={node} />
        ))}
      </Box>
    </Box>
  )
}
