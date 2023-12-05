import { Box } from '@fower/react'
import { Node } from 'slate'
import { useEditor, useEditorStatic } from '@penx/editor-common'
import { ElementProps } from '@penx/extension-typings'
import { NodeType } from '@penx/model-types'
import { useFocusTitle } from '../../hooks/useFocusTitle'
import { insertEmptyList } from '../../transforms/insertEmptyList'
import { TitleElement } from '../../types'
import { DailyNoteNav } from './DailyNoteNav'
import { EmptyTips } from './EmptyTips'
import { TagMenu } from './TagMenu'
import { TaskProgress } from './TaskProgress'

export const CommonTitle = ({
  element,
  children,
  nodeProps,
}: ElementProps<TitleElement>) => {
  const titleStr = Node.string(element)
  const isPlaceholderShow = !titleStr?.length

  return (
    <Box
      leadingNone
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
  )
}
