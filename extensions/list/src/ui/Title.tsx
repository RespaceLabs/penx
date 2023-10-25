import { Box } from '@fower/react'
import { Node } from 'slate'
import { useEditor } from '@penx/editor-common'
import { ElementProps } from '@penx/extension-typings'
import { insertEmptyList } from '../transforms/insertEmptyList'

export const Title = ({
  element,
  attributes,
  children,
  nodeProps,
}: ElementProps) => {
  const editor = useEditor()
  const str = Node.string(element)
  const isPlaceholderShow = !str?.length
  const onlyHasTitle = editor.children.length === 1

  function insertList() {
    insertEmptyList(editor, { at: [1], select: true })
  }

  return (
    <Box
      as="h1"
      pl5
      text4XL
      fontSemibold
      gray900
      relative
      {...attributes}
      {...nodeProps}
      className="page-title"
      css={{
        '::before': {
          content: `"Untitled"`,
          gray200: true,
          breakNormal: true,
          display: isPlaceholderShow ? 'block' : 'none',
          absolute: true,
          top: '50%',
          transform: 'translate(0, -50%)',
          whiteSpace: 'nowrap',
          cursorText: true,
        },
      }}
    >
      {children}
      {onlyHasTitle && (
        <Box
          contentEditable={false}
          gray300
          textSM
          fontNormal
          mt2
          onClick={insertList}
        >
          Write something...
        </Box>
      )}
    </Box>
  )
}
