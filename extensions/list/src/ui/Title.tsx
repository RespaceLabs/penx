import { useEffect } from 'react'
import { Box } from '@fower/react'
import { Editor, Node, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import { useEditorStatic } from '@penx/editor-common'
import { ElementProps } from '@penx/extension-typings'
import { NodeType } from '@penx/model-types'
import { insertEmptyList } from '../transforms/insertEmptyList'
import { TitleElement } from '../types'
import { DailyNoteNav } from './DailyNoteNav'

export const Title = ({
  element,
  attributes,
  children,
  nodeProps,
}: ElementProps<TitleElement>) => {
  const editor = useEditorStatic()
  const titleStr = Node.string(element)
  const isPlaceholderShow = !titleStr?.length
  const onlyHasTitle = editor.children.length === 1

  function insertList() {
    insertEmptyList(editor, { at: [1], select: true })
  }

  const disabled = [
    NodeType.INBOX,
    NodeType.DAILY_NOTE,
    NodeType.DATABASE_ROOT,
  ].includes(element.nodeType as any)

  const isDailyNote = element.nodeType === NodeType.DAILY_NOTE
  const firstLineNode = editor.children[1]
  const firstLineStr = firstLineNode ? Node.string(firstLineNode) : ''

  // TODO: have bugs
  useEffect(() => {
    // focus on title
    if (onlyHasTitle || !titleStr) {
      setTimeout(() => {
        Transforms.select(editor, Editor.end(editor, [0, 0]))
        ReactEditor.focus(editor)
      }, 0)
    }

    // focus to the first line
    if (titleStr && firstLineNode && !firstLineStr) {
      setTimeout(() => {
        // Transforms.select(editor, Editor.end(editor, [1]))
        // ReactEditor.focus(editor)
      }, 0)
    }
  }, [onlyHasTitle, editor, titleStr, firstLineStr, firstLineNode])

  return (
    <Box
      pl5
      text4XL
      fontSemibold
      gray900
      relative
      cursorNotAllowed={disabled}
      mb4
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
      {isDailyNote && <DailyNoteNav element={element} />}

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
