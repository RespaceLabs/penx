import { Box } from '@fower/react'
import { Node } from '@penx/model'
import { NodeService } from '@penx/service'
import { store } from '@penx/store'
import { DocItemMenu } from './DocItemMenu'

interface Props {
  node: Node
}

export const DocItem = ({ node }: Props) => {
  return (
    <Box
      className="docItem"
      toCenterY
      gap2
      gray500
      textSM
      py2
      px1
      bgGray100--hover
      cursorPointer
      rounded
      onClick={() => {
        const nodeService = new NodeService(
          node,
          store.getNodes().map((node) => new Node(node)),
        )
        nodeService.selectNode()
      }}
    >
      <Box flex-1>{node.title || 'Untitled'}</Box>
      <DocItemMenu node={node} />
    </Box>
  )
}
