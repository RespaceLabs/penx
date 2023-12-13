import { useEffect } from 'react'
import { Box } from '@fower/react'
import { Node } from 'slate'
import { useEditor, useEditorStatic } from '@penx/editor-common'
import { useCompositionData } from '@penx/editor-composition'
import { ElementProps } from '@penx/extension-typings'
import { TitleElement } from '../../types'

export const CommonTitle = ({
  element,
  children,
}: ElementProps<TitleElement>) => {
  const titleStr = Node.string(element)
  const { compositionData } = useCompositionData(element.id)
  const isPlaceholderShow = !titleStr?.length && !compositionData

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
