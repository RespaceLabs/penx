import { Box } from '@fower/react'
import { Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import { useDebouncedCallback } from 'use-debounce'
import { DocEditor } from '@penx/editor'
import { isAstChange } from '@penx/editor-queries'
import { useNode, useNodes } from '@penx/hooks'
import { insertEmptyListItem, ListContentElement } from '@penx/list'
import { db } from '@penx/local-db'
import { store } from '@penx/store'

function listPlugin(editor: any) {
  editor.onClickBullet = async (element: ListContentElement) => {
    const node = await db.getNode(element.id)
    const nodes = await db.listNormalNodes(node.spaceId)
    store.setNodes(nodes)
    store.reloadNode(node)
  }
  return editor
}

export function NodeContent() {
  const { nodes } = useNodes()
  const { node, nodeService } = useNode()

  const debouncedSaveNodes = useDebouncedCallback(async (value: any[]) => {
    nodeService.savePage(value[0], value[1])
  }, 500)

  function handleEnterKeyInTitle(editor: Editor) {
    insertEmptyListItem(editor, { at: [0, 0] })

    ReactEditor.focus(editor as any)
    Transforms.select(editor, Editor.start(editor, [0]))
  }

  if (!node.id || !nodes.length) return null

  return (
    <Box relative>
      <Box mx-auto maxW-800>
        <DocEditor
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
