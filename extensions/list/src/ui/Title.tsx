import { Box } from '@fower/react'
import { Node } from 'slate'
import { useEditorStatic } from '@penx/editor-common'
import { ElementProps } from '@penx/extension-typings'
import { NodeType } from '@penx/types'
import { insertEmptyList } from '../transforms/insertEmptyList'
import { TitleElement } from '../types'

export const Title = ({
  element,
  attributes,
  children,
  nodeProps,
}: ElementProps<TitleElement>) => {
  const editor = useEditorStatic()
  const str = Node.string(element)
  const isPlaceholderShow = !str?.length
  const onlyHasTitle = editor.children.length === 1

  function insertList() {
    insertEmptyList(editor, { at: [1], select: true })
  }

  const disabled = [NodeType.INBOX, NodeType.DAILY_NOTE].includes(
    element.nodeType as any,
  )

  return (
    <Box
      pl5
      text4XL
      fontSemibold
      gray900
      relative
      cursorNotAllowed={disabled}
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
