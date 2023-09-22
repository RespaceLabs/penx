import { memo } from 'react'
import { Box } from '@fower/react'
import { Node } from 'slate'
import { useSlate, useSlateStatic } from 'slate-react'
import { getLastNode } from '@penx/editor-queries'
import { ElementType } from '@penx/editor-shared'
import { insertEmptyElement, selectEditor } from '@penx/editor-transforms'

const ClickablePadding = () => {
  const editor = useSlateStatic()

  return (
    <Box
      className="clickable-padding"
      minH-200
      cursorText
      onClick={(e) => {
        e.preventDefault()
        const entry = getLastNode(editor, 0)

        if (!entry) return

        if (entry) {
          const [node, path] = entry

          if (node.type === ElementType.p) {
            if (Node.string(node) === '') {
              selectEditor(editor, { focus: true, edge: 'end' })
              return
            }
          }

          const at = [path[0] + 1, ...path.slice(1)]
          insertEmptyElement(editor, ElementType.p, { at })
          selectEditor(editor, { focus: true, edge: 'end' })
        }
      }}
    />
  )
}

export default memo(ClickablePadding)
