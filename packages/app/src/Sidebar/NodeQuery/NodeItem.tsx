import { memo } from 'react'
import { Box } from '@fower/react'
import { useSidebarDrawer } from '@penx/hooks'
import { Node } from '@penx/model'
import { NodeService } from '@penx/service'
import { store } from '@penx/store'
import { NodeItemMenu } from './NodeItemMenu'

interface Props {
  node: Node
}

export const NodeItem = memo(
  function NodeItem({ node }: Props) {
    const { close } = useSidebarDrawer()

    return (
      <Box
        className="nodeItem"
        toCenterY
        gap2
        gray500
        textSM
        h-24
        px1
        bgGray100--hover
        cursorPointer
        rounded
        onClick={() => {
          const nodeService = new NodeService(
            node,
            store.getNodes().map((n) => new Node(n)),
          )
          nodeService.selectNode()
          close?.()
        }}
      >
        <Box flex-1>{node.title || 'Untitled'}</Box>
        <Box inlineFlex onClick={(e) => e.stopPropagation()}>
          <NodeItemMenu node={node} />
        </Box>
      </Box>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.node.id === nextProps.node.id &&
      prevProps.node.title === nextProps.node.title
    )
  },
)
