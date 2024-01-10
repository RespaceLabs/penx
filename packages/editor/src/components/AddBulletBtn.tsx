import { Box } from '@fower/react'
import { PlusIcon } from 'lucide-react'
import { Editor, Path, Transforms } from 'slate'
import { useEditorStatic } from '@penx/editor-common'
import { findNodePath } from '@penx/editor-queries'
import { selectEditor } from '@penx/editor-transforms'
import { insertEmptyList, insertEmptyParagraph, listSchema } from '@penx/list'

const newListItem = listSchema.createListItemNode({
  children: [
    listSchema.createListItemTextNode({
      children: [
        {
          type: 'p',
          children: [{ text: '' }],
        } as any,
      ],
    }),
  ],
})

export function AddBulletBtn() {
  const editor = useEditorStatic()

  function addBullet() {
    if (!editor.isOutliner) {
      const node = editor.children[editor.children.length - 1]
      const nodePath = findNodePath(editor, node)!
      const at = Path.next(nodePath)
      insertEmptyParagraph(editor, { at })
      selectEditor(editor, { focus: true, at })
      return
    }

    if (editor.children.length === 1) {
      insertEmptyList(editor, { at: [1] })
      selectEditor(editor, { focus: true, at: [1] })
      return
    }

    const path = Editor.end(editor, [1]).path

    const node = Editor.above(editor, {
      at: path,
      match: listSchema.isListItemNode,
    })

    if (node) {
      const at = Path.next(node[1])
      Transforms.insertNodes(editor, newListItem, { at })
      selectEditor(editor, { focus: true, at })
    }
  }

  return (
    <Box
      inlineFlex
      bgGray100--hover
      roundedFull
      toCenter
      gray400
      cursorPointer
      ml-14={editor.isOutliner}
      ml--8={!editor.isOutliner}
      mt2
      circle5
      onClick={addBullet}
    >
      <PlusIcon size={14} strokeWidth={1.5} />
    </Box>
  )
}
