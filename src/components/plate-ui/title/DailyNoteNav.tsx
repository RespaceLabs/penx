import { forwardRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { store } from '@/store'
import { Calendar, CalendarDays } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DailyShortcut } from './DailyShortcut'

export const DailyNoteNav = ({ date }: { date?: string }) => {
  const currentDate = new Date(date ?? Date.now())

  return (
    <div
      contentEditable={false}
      className="text-xs font-normal flex items-center gap-4 text-foreground/60"
    >
      <DailyShortcut date={date} />
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
      className="inline-flex items-center justify-center text-foreground/50 cursor-pointer ml-2 m-0 p-0 h-full"
      onClick={onClick}
    >
      <CalendarDays size={20} />
    </div>
  )
})

function GoToDay({ date }: { date: Date }) {
  const { push } = useRouter()
  const [startDate, setStartDate] = useState(date || new Date())
  return (
    <DatePicker
      selected={startDate}
      onChange={async (date) => {
        setStartDate(date!)
      }}
      customInput={<CustomInput />}
    />
  )
}
