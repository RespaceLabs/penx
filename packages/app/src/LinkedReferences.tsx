import { memo } from 'react'
import { Box } from '@fower/react'
import { ChevronRight } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'
import { NodeEditor } from '@penx/editor'
import { PenxEditor } from '@penx/editor-common'
import { isAstChange } from '@penx/editor-queries'
import { useNode, useNodes } from '@penx/hooks'
import { db } from '@penx/local-db'
import { Node } from '@penx/model'
import { NodeService } from '@penx/service'
import { store } from '@penx/store'

interface ReferenceItemProps {
  node: Node
}
const ReferenceItem = memo(function ReferenceItem({
  node,
}: ReferenceItemProps) {
  const { nodes } = useNodes()
  const nodeService = new NodeService(node, nodes)
  const parentNodes = nodeService.getParentNodes().slice(0, -1)

  return (
    <Box bgGray100--T40 rounded px3 py2>
      <Box toCenterY pl0 mb1>
        {parentNodes.map((node, index) => {
          const isLast = index === parentNodes.length - 1
          return (
            <Box key={node.id} toCenterY>
              <Box
                cursorPointer
                onClick={() => nodeService.selectNode(node)}
                gray700
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

      <NodeEditor
        // plugins={[listPlugin as any]}
        plugins={[]}
        content={nodeService.getEditorValue([node], false)}
        node={node}
        onChange={(value, editor) => {
          // if (isAstChange(editor)) {
          //   debouncedSaveNodes(value)
          // }
        }}
      />
    </Box>
  )
})

interface LinkedReferencesProps {
  node: Node
}

export function LinkedReferences({ node }: LinkedReferencesProps) {
  const { nodeList } = useNodes()
  const linkedNodes = nodeList.getLinkedReferences(node)

  if (!linkedNodes.length) return null

  return (
    <Box relative mt20 column gap2>
      {linkedNodes.map((linkedNode) => (
        <ReferenceItem key={linkedNode.id} node={linkedNode} />
      ))}
    </Box>
  )
}
