import { ITitleElement } from '@/components/editor/plugins/title-plugin'
import { Badge } from '@/components/ui/badge'
import { PlateElementProps } from '@udecode/plate-common/react'
import { format } from 'date-fns'
import { DailyNoteNav } from './DailyNoteNav'

export const DailyTitle = ({
  attributes,
  element,
  children,
}: PlateElementProps<ITitleElement>) => {
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const isToday = element.props.date === todayStr
  const date = element.props.date

  return (
    <div className="leading-none flex flex-col gap-2 font-bold text-4xl">
      <div className="flex items-center gap-2">
        <div>{children}</div>
        {isToday && <Badge contentEditable={false}>Today</Badge>}
      </div>
      <DailyNoteNav date={date} />
    </div>
  )
}
