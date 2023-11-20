import { Box } from '@fower/react'
import { useDebouncedCallback } from 'use-debounce'
import { NodeEditor } from '@penx/editor'
import { isAstChange } from '@penx/editor-queries'
import { useNode, useNodes } from '@penx/hooks'
import { LinkedReferences } from './LinkedReferences'
import { withBulletPlugin } from './plugins/withBulletPlugin'

export function NodeContent() {
  const { nodes } = useNodes()
  const { node, nodeService } = useNode()

  const debouncedSaveNodes = useDebouncedCallback(async (value: any[]) => {
    nodeService.savePage(node.raw, value[0], value[1])
  }, 500)

  if (!node.id || !nodes.length) return null

  // console.log('nodes=========:', nodes)
  // console.log('node========:', nodeService.getEditorValue())
  // console.log('node content========:', node.raw, nodeService.parentNode)

  return (
    <Box relative mt10>
      <Box mx-auto maxW-800>
        <NodeEditor
          plugins={[withBulletPlugin]}
          content={nodeService.getEditorValue()}
          node={node}
          onChange={(value, editor) => {
            if (isAstChange(editor)) {
              debouncedSaveNodes(value)
            }
          }}
        />
        <LinkedReferences node={node} />
      </Box>
    </Box>
  )
}
