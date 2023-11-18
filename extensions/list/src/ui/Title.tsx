import { Box } from '@fower/react'
import { Node } from 'slate'
import { useEditorStatic } from '@penx/editor-common'
import { ElementProps } from '@penx/extension-typings'
import { NodeType } from '@penx/model-types'
import { useFocusTitle } from '../hooks/useFocusTitle'
import { insertEmptyList } from '../transforms/insertEmptyList'
import { TitleElement } from '../types'
import { DailyNoteNav } from './DailyNoteNav'
import { TaskProgress } from './TaskProgress'

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

  useFocusTitle(element)

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
      // {...nodeProps}
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
      {!isDailyNote && children}
      {isDailyNote && (
        <Box toCenterY gap2>
          <TaskProgress />
          <Box
            leadingNone
            column
            gap2
            css={{
              '> div': {
                'leadingNone--i': true,
              },
            }}
          >
            {children}
            {isDailyNote && <DailyNoteNav element={element} />}
          </Box>
        </Box>
      )}

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
