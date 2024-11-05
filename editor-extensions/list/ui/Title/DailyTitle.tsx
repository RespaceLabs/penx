import { Badge } from '@/components/ui/badge'
import { ElementProps } from '@/lib/extension-typings'
import { format } from 'date-fns'
import { TitleElement } from '../../types'
import { DailyNoteNav } from './DailyNoteNav'

export const DailyTitle = ({
  element,
  children,
}: ElementProps<TitleElement>) => {
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const isToday = element.props.date === todayStr

  const date = element.props.date

  return (
    <div className="flex items-center gap-2">
      <div
        className="leading-none flex flex-col gap-2"
        // css={{
        //   '> div': {
        //     'leadingNone--i': true,
        //   },
        // }}
      >
        <div className="flex items-center gap-2">
          <div>{children}</div>
          {isToday && <Badge contentEditable={false}>Today</Badge>}
        </div>
        <DailyNoteNav date={date} />
      </div>
    </div>
  )
}
