import { Box } from '@fower/react'
import { format } from 'date-fns'
import { ElementProps } from '@penx/extension-typings'
import { DailyEntryElement } from '../types'

export const DailyEntry = ({
  attributes,
  element,
  children,
}: ElementProps<DailyEntryElement>) => {
  const title = format(new Date(element.props.date!), 'EEEE, LLL do')

  return (
    <Box flex-1 contentEditable={false} {...attributes} leadingNormal>
      <Box inlineFlex px2 py-2 rounded>
        {title}
      </Box>
      {children}
    </Box>
  )
}
