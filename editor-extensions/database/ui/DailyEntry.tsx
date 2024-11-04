import { ElementProps } from '@/lib/extension-typings'
import { format } from 'date-fns'
import { DailyEntryElement } from '../types'

export const DailyEntry = ({
  attributes,
  element,
  children,
}: ElementProps<DailyEntryElement>) => {
  const title = format(new Date(element.date!), 'EEEE, LLL do')

  return (
    <div
      className="flex-1 leading-normal"
      contentEditable={false}
      {...attributes}
    >
      <div className="inline-flex px-2 py-2 rounded">{title}</div>
      {children}
    </div>
  )
}
