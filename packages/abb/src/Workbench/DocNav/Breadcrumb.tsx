import { Box } from '@fower/react'
import { ChevronRight } from 'lucide-react'
import { useNodeContext } from '@penx/hooks'

export const Breadcrumb = () => {
  const { nodeService } = useNodeContext()
  const parentNodes = nodeService.getParentNodes()

  return (
    <Box toCenterY>
      {parentNodes.map((node, index) => {
        const isLast = index === parentNodes.length - 1
        return (
          <Box key={node.id} toCenterY>
            <Box
              cursorPointer
              onClick={() => nodeService.selectNode(node)}
              gray700
              maxW-160
              black={isLast}
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {node.title || 'Untitled'}
            </Box>
            {!isLast && (
              <Box gray500 pl2 pr1 toCenterY mb--2>
                <ChevronRight size={12} />
              </Box>
            )}
          </Box>
        )
      })}
    </Box>
  )
}
