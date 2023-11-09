import { Box } from '@fower/react'
import { useDebouncedCallback } from 'use-debounce'
import { TableView } from '@penx/database'
import { NodeEditor } from '@penx/editor'
import { isAstChange } from '@penx/editor-queries'
import { useNode, useNodes } from '@penx/hooks'
import { db } from '@penx/local-db'
import { store } from '@penx/store'

function listPlugin(editor: any) {
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
    // has title
    if (value[1]) {
      nodeService.savePage(node.raw, value[1], value[0])
    } else {
      nodeService.savePage(node.raw, value[0])
    }
  }, 500)

  if (!node.id || !nodes.length) return null

  console.log('node======:', node)
  // return null
  // if (node.isDatabase) {
  //   return (
  //     <Box>
  //       <TableView databaseId={node.id} />
  //     </Box>
  //   )
  // }

  return (
    <Box relative>
      <Box mx-auto maxW-800>
        <NodeEditor
          plugins={[listPlugin]}
          content={nodeService.getEditorValue()}
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
