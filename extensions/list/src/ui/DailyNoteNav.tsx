import { Box } from '@fower/react'
import { useEditorStatic } from '@penx/editor-common'
import { TitleElement } from '../types'

export const DailyNoteNav = ({ element }: { element: TitleElement }) => {
  const editor = useEditorStatic()

  return (
    <Box
      contentEditable={false}
      textXS
      fontNormal
      toCenterY
      gap1
      cursorPointer
      gray600
    >
      <Box bgGray100 px3 py2 roundedFull bgGray200--hover transitionColors>
        Previous day
      </Box>
      <Box></Box>
      <Box bgGray100 px3 py2 roundedFull bgGray200--hover transitionColors>
        Next day
      </Box>
    </Box>
  )
}
