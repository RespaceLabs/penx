import { Box } from '@fower/react'
import { useNodeContext, useNodes } from '@penx/node-hooks'
import { NodeService } from '@penx/service'
import { BreadcrumbPopover } from './BreadcrumbPopover'

export const Breadcrumb = () => {
  const { node } = useNodeContext()
  const { nodes } = useNodes()
  const nodeService = new NodeService(node, nodes)
  const parentNodes = nodeService.getParentNodes()

  return (
    <Box toCenterY textSM gap1>
      {parentNodes.map((node, index) => {
        const isLast = index === parentNodes.length - 1
        if (node.isList) return null
        return (
          <Box key={node.id} toCenterY textSM gap1>
            <Box
              cursorPointer
              onClick={() => nodeService.selectNode(node)}
              gray600
              maxW-160
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {node.title || 'Untitled'}
            </Box>
            {!isLast && <BreadcrumbPopover node={node} />}
          </Box>
        )
      })}
    </Box>
  )
}
