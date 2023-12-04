import { Box } from '@fower/react'
import { Node } from 'slate'
import { useEditor, useEditorStatic } from '@penx/editor-common'
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
  const editor = useEditor()
  const titleStr = Node.string(element)
  const isPlaceholderShow = !titleStr?.length
  const onlyHasTitle = editor.children.length === 1

  function insertList() {
    insertEmptyList(editor, { at: [1], select: true })
  }

  const disabled = [
    NodeType.INBOX,
    NodeType.DAILY,
    NodeType.DATABASE_ROOT,
  ].includes(element.nodeType as any)

  const isDaily = element.nodeType === NodeType.DAILY
  const isDatabase = element.nodeType === NodeType.DATABASE

  useFocusTitle(element)

  return (
    <Box
      pl5
      pl9={isDatabase}
      text={[28, 28, 36]}
      fontMedium
      gray900
      relative
      cursorNotAllowed={disabled}
      mb4
      {...attributes}
      // {...nodeProps}
    >
      {isDatabase && (
        <Box absolute left3 top0 h="1.5em" toCenterY>
          <Box contentEditable={false} color={element.props?.color || 'black'}>
            #
          </Box>
        </Box>
      )}
      {!isDaily && (
        <Box
          h="1.5em"
          css={{
            '::before': {
              content: `"Untitled"`,
              gray200: true,
              breakNormal: true,
              display: isPlaceholderShow ? 'block' : 'none',
              absolute: true,
              h: '1.5em',
              leading: '1.5em',
              top: 0,
              // top: '50%',
              // transform: 'translate(0, -50%)',
              whiteSpace: 'nowrap',
              cursorText: true,
            },
          }}
        >
          {children}
        </Box>
      )}
      {isDaily && (
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
            {isDaily && <DailyNoteNav element={element} />}
          </Box>
        </Box>
      )}

      {onlyHasTitle && (
        <Box
          contentEditable={false}
          gray300
          textSM
          fontNormal
          mt5
          onClick={insertList}
        >
          Write something...
        </Box>
      )}
    </Box>
  )
}
