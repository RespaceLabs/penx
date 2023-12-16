import { forwardRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { Box } from '@fower/react'
import { addDays, sub, subDays } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import { store } from '@penx/store'
import { TitleElement } from '../../types'

export const DailyNoteNav = ({ element }: { element: TitleElement }) => {
  const date = new Date(element.props?.date ?? Date.now())

  return (
    <Box contentEditable={false} textXS fontNormal toCenterY gap1 gray600>
      <Box
        bgGray100
        px3
        py2
        roundedFull
        bgGray200--hover
        transitionColors
        cursorPointer
        onClick={() => {
          store.node.selectDailyNote(subDays(date, 1))
        }}
      >
        Previous day
      </Box>
      <Box
        bgGray100
        px3
        py2
        roundedFull
        bgGray200--hover
        transitionColors
        cursorPointer
        onClick={() => {
          store.node.selectDailyNote(addDays(date, 1))
        }}
      >
        Next day
      </Box>

      <Box
        bgGray100
        px3
        py2
        roundedFull
        bgGray200--hover
        transitionColors
        cursorPointer
        onClick={() => {
          store.node.selectDailyNote(new Date())
        }}
      >
        Today
      </Box>
      <GoToDay date={date}></GoToDay>
    </Box>
  )
}

function GoToDay({ date }: { date: Date }) {
  const [startDate, setStartDate] = useState(date || new Date())
  const CustomInput = forwardRef<HTMLDivElement, any>(function CustomInput(
    { onClick },
    ref,
  ) {
    return (
      <Box ref={ref} gray500 inlineFlex cursorPointer ml2 onClick={onClick}>
        <CalendarDays size={20} />
      </Box>
    )
  })
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
