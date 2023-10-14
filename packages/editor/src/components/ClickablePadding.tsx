import { memo } from 'react'
import { Box } from '@fower/react'
import { Node } from 'slate'
import { useSlate } from 'slate-react'
import { getLastNode } from '@penx/editor-queries'
import { selectEditor } from '@penx/editor-transforms'
import { insertEmptyParagraph, isParagraph } from '@penx/paragraph'

const ClickablePadding = () => {
  const editor = useSlate()

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

          if (isParagraph(node)) {
            if (Node.string(node) === '') {
              selectEditor(editor, { focus: true, edge: 'end' })
              return
            }
          }

          const at = [path[0] + 1, ...path.slice(1)]
          insertEmptyParagraph(editor, { at })
          selectEditor(editor, { focus: true, edge: 'end' })
        }
      }}
    />
  )
}

export default memo(ClickablePadding)
