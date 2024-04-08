import { forwardRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { Box } from '@fower/react'
import { IconCalendar } from '@penx/icons'
import { store } from '@penx/store'
import { DailyShortcut } from '@penx/widget'

export const DailyNoteNav = ({ date }: { date?: string }) => {
  const currentDate = new Date(date ?? Date.now())

  return (
    <Box contentEditable={false} textXS fontNormal toCenterY gap4 gray600>
      <DailyShortcut date={date} />
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
      onClick={onClick}
    >
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
