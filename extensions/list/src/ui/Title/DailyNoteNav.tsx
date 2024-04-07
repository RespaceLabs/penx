import { forwardRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { Box } from '@fower/react'
import { addDays, subDays } from 'date-fns'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { IconCalendar } from '@penx/icons'
import { store } from '@penx/store'
import { DailyShortcut } from '@penx/widget'

export const DailyNoteNav = ({ date }: { date?: string }) => {
  const currentDate = new Date(date ?? Date.now())

  return (
    <Box contentEditable={false} textXS fontNormal toCenterY gap1 gray600>
      <GoToDay date={currentDate}></GoToDay>
    </Box>
  )
}

const CustomInput = forwardRef<HTMLDivElement, any>(function CustomInput(
  { onClick },
  ref,
) {
  return (
    <Box
      ref={ref}
      toCenterY
      gray500
      inlineFlex
      cursorPointer
      ml2
      gap4
      onClick={onClick}
    >
      <DailyShortcut />
      <IconCalendar size={20} stroke="gray500" />
    </Box>
  )
})

function GoToDay({ date }: { date: Date }) {
  const [startDate, setStartDate] = useState(date || new Date())
  return (
    <DatePicker
      selected={startDate}
      onChange={(date) => {
        setStartDate(date!)
        if (date) {
          store.node.selectDailyNote(date)
        }
      }}
      customInput={<CustomInput />}
    />
  )
}
