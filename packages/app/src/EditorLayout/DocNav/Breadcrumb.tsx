import { Box } from '@fower/react'
import { ChevronRight } from 'lucide-react'
import { useNode } from '@penx/hooks'

export const Breadcrumb = () => {
  const { nodeService } = useNode()
  const parentNodes = nodeService.getParentNodes()

  return (
    <Box toCenterY pl4>
      {parentNodes.map((node, index) => {
        const isLast = index === parentNodes.length - 1
        return (
          <Box key={node.id} toCenterY>
            <Box
              cursorPointer
              onClick={() => nodeService.selectNode(node)}
              gray700
              black={isLast}
            >
              {node.title}
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
