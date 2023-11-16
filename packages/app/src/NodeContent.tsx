import { Box } from '@fower/react'
import { useDebouncedCallback } from 'use-debounce'
import { NodeEditor } from '@penx/editor'
import { PenxEditor } from '@penx/editor-common'
import { isAstChange } from '@penx/editor-queries'
import { useNode, useNodes } from '@penx/hooks'
import { db } from '@penx/local-db'
import { store } from '@penx/store'

function listPlugin(editor: PenxEditor) {
  editor.onClickBullet = async (nodeId: string) => {
    const node = await db.getNode(nodeId)
    store.selectNode(node)
  }
  return editor
}

export function NodeContent() {
  const { nodes } = useNodes()
  const { node, nodeService } = useNode()

  const debouncedSaveNodes = useDebouncedCallback(async (value: any[]) => {
    nodeService.savePage(node.raw, value[0], value[1])
  }, 500)

  if (!node.id || !nodes.length) return null

  // console.log('nodes=========:', nodes)
  // console.log('node========:', nodeService.getEditorValue())
  // console.log('node content========:', node.raw)

  return (
    <Box relative>
      <Box mx-auto maxW-800>
        <NodeEditor
          plugins={[listPlugin as any]}
          content={nodeService.getEditorValue()}
          node={node}
          onChange={(value, editor) => {
            if (isAstChange(editor)) {
              debouncedSaveNodes(value)
            }
          }}
        />
      </Box>
    </Box>
  )
}
