import { memo } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'
import { ChevronRight } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'
import { NodeEditor } from '@penx/editor'
import { isAstChange } from '@penx/editor-queries'
import { useDatabase, useNodes } from '@penx/hooks'
import { Node } from '@penx/model'
import { NodeToSlateSerializer } from '@penx/serializer'
import { NodeService } from '@penx/service'
import { withBulletPlugin } from '../plugins/withBulletPlugin'

interface ReferenceItemProps extends FowerHTMLProps<'div'> {
  node: Node
}
const ReferenceItem = memo(function ReferenceItem({
  node,
  ...rest
}: ReferenceItemProps) {
  const { nodes } = useNodes()
  const nodeService = new NodeService(node, nodes)
  const parentNodes = nodeService.getParentNodes().slice(0, -1)

  const serializer = new NodeToSlateSerializer(node, nodes)

  const debouncedSaveNodes = useDebouncedCallback(async (value: any[]) => {
    nodeService.savePage(
      nodeService.parentNode?.raw!,
      null as any,
      value[0],
      true,
    )
  }, 500)

  return (
    <Box rounded py2 px3 bgGray100--T40 {...rest}>
      <Box toCenterY pl0 mb1>
        {parentNodes.map((node, index) => {
          const isLast = index === parentNodes.length - 1
          return (
            <Box key={node.id} toCenterY>
              <Box
                cursorPointer
                onClick={() => nodeService.selectNode(node)}
                brand500
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
        plugins={[withBulletPlugin]}
        content={serializer.getEditorValue([node], false)}
        node={node}
        onChange={(value, editor) => {
          if (isAstChange(editor)) {
            debouncedSaveNodes(value)
          }
        }}
      />
    </Box>
  )
})

interface LinkedReferencesProps {
  node: Node
}

export function LinkedReferences({ node }: LinkedReferencesProps) {
  // console.log('=========x:', node)

  const { nodeList } = useNodes()
  const linkedNodes = nodeList.getLinkedReferences(node)

  if (!linkedNodes.length) return null

  return (
    <Box mt20 px4>
      <Box fontSemibold gray300 mb2>
        References ({linkedNodes.length})
      </Box>

      <Box column gap2>
        {linkedNodes.map((linkedNode) => (
          <ReferenceItem key={linkedNode.id} node={linkedNode} />
        ))}
      </Box>
    </Box>
  )
}
