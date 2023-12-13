import { Box } from '@fower/react'
import { format } from 'date-fns'
import { Tag } from 'uikit'
import { ElementProps } from '@penx/extension-typings'
import { TitleElement } from '../../types'
import { DailyNoteNav } from './DailyNoteNav'
import { TaskProgress } from './TaskProgress'

export const DailyTitle = ({
  element,
  children,
}: ElementProps<TitleElement>) => {
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const isToday = element.props.date === todayStr

  return (
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
        <Box toCenterY gap2>
          <Box>{children}</Box>
          {isToday && (
            <Tag variant="light" contentEditable={false}>
              Today
            </Tag>
          )}
        </Box>
        <DailyNoteNav element={element} />
      </Box>
    </Box>
  )
}
