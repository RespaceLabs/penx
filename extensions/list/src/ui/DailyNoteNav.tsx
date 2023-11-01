import { Box } from '@fower/react'
import { addDays, sub, subDays } from 'date-fns'
import { store } from '@penx/store'
import { TitleElement } from '../types'

export const DailyNoteNav = ({ element }: { element: TitleElement }) => {
  const date = new Date(element.props?.date!)
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
      <Box
        bgGray100
        px3
        py2
        roundedFull
        bgGray200--hover
        transitionColors
        onClick={() => {
          store.selectDailyNote(subDays(date, 1))
        }}
      >
        Previous day
      </Box>
      <Box></Box>
      <Box
        bgGray100
        px3
        py2
        roundedFull
        bgGray200--hover
        transitionColors
        onClick={() => {
          store.selectDailyNote(addDays(date, 1))
        }}
      >
        Next day
      </Box>
    </Box>
  )
}
