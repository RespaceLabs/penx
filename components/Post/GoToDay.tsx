'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface Props {
  initialDate: Date
}

export function GoToDay({ initialDate }: Props) {
  const [date, setDate] = useState<Date | undefined>(initialDate || new Date())
  const [open, setOpen] = useState(false)
  const { push } = useRouter()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <CalendarDays size={20} className="cursor-pointer text-foreground/60" />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            // console.log('========date:', date)
            setOpen(false)
            setDate(date)
            const dateStr = format(date!, 'yyyy-MM-dd')
            push(`/~/page?id=${dateStr}`)
          }}
          // disabled={(date) =>
          //   date > new Date() || date < new Date('1900-01-01')
          // }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
