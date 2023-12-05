import { Box } from '@fower/react'
import { Node } from 'slate'
import { useEditor, useEditorStatic } from '@penx/editor-common'
import { ElementProps } from '@penx/extension-typings'
import { NodeType } from '@penx/model-types'
import { useFocusTitle } from '../../hooks/useFocusTitle'
import { insertEmptyList } from '../../transforms/insertEmptyList'
import { TitleElement } from '../../types'
import { CommonTitle } from './CommonTitle'
import { DailyNoteNav } from './DailyNoteNav'
import { EmptyTips } from './EmptyTips'
import { TagMenu } from './TagMenu'
import { TaskProgress } from './TaskProgress'

export const Title = (props: ElementProps<TitleElement>) => {
  const { element, attributes, children, nodeProps } = props
  const editor = useEditor()
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
      {isDatabase && <TagMenu element={element} />}
      {!isDaily && <CommonTitle {...props} />}
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

      {onlyHasTitle && <EmptyTips />}
    </Box>
  )
}
