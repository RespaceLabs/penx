import { forwardRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { store } from '@/store'
import { Calendar } from 'lucide-react'

export const DailyNoteNav = ({ date }: { date?: string }) => {
  const currentDate = new Date(date ?? Date.now())

  return (
    <div
      contentEditable={false}
      className="text-xs font-normal flex items-center gap-4 text-foreground/600"
    >
      <GoToDay date={currentDate}></GoToDay>
    </div>
  )
}

const CustomInput = forwardRef<HTMLDivElement, any>(function CustomInput(
  { onClick },
  ref,
) {
  return (
    <div
      ref={ref}
      className="inline-flex items-center justify-center text-foreground/50 cursor-pointer ml-2"
      onClick={onClick}
    >
      <Calendar size={20} stroke="gray500" />
    </div>
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
