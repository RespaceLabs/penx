import { forwardRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { Box } from '@fower/react'
import { addDays, subDays } from 'date-fns'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { store } from '@penx/store'
import { TitleElement } from '../../types'

export const DailyNoteNav = ({ element }: { element: TitleElement }) => {
  const date = new Date(element.date ?? Date.now())

  return (
    <Box contentEditable={false} textXS fontNormal toCenterY gap1 gray600>
      <Box
        bgGray100
        px2
        py-6
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
      <Box toCenterY gap2 ml2>
        <Box
          bgGray100
          circle5
          toCenter
          bgGray200--hover
          transitionColors
          cursorPointer
          onClick={() => {
            store.node.selectDailyNote(subDays(date, 1))
          }}
        >
          <ChevronLeft size={16} />
        </Box>
        <Box
          bgGray100
          circle5
          toCenter
          bgGray200--hover
          transitionColors
          cursorPointer
          onClick={() => {
            store.node.selectDailyNote(addDays(date, 1))
          }}
        >
          <ChevronRight size={16} />
        </Box>
      </Box>

      <GoToDay date={date}></GoToDay>
    </Box>
  )
}

const CustomInput = forwardRef<HTMLDivElement, any>(function CustomInput(
  { onClick },
  ref,
) {
  return (
    <Box ref={ref} gray500 inlineFlex cursorPointer ml2 onClick={onClick}>
      <CalendarDays size={18} />
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
