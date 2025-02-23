import { forwardRef } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'
import { addDays, format, subDays } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props extends FowerHTMLProps<'div'> {
  date?: string
}

export const JournalShortcut = forwardRef<HTMLDivElement, Props>(
  function DailyShortcut({ date, ...rest }, ref) {
    const currentDate = new Date(date ?? Date.now())
    const { push } = useRouter()

    return (
      <div ref={ref} className="text-xs flex items-center" {...rest}>
        <div
          className="bg-foreground/5 px-2 py-[6px] rounded-full hover:bg-foreground/10 transition-colors cursor-pointer"
          onClick={() => {
            const dateStr = format(new Date(), 'yyyy-MM-dd')
            push(`/~/page?id=${dateStr}`)
          }}
        >
          Today
        </div>
        <div className="flex items-center gap-2 ml-2">
          <div
            className="bg-foreground/5 px-2 py-[6px] rounded-full hover:bg-foreground/10 transition-colors cursor-pointer"
            onClick={() => {
              const dateStr = format(subDays(currentDate, 1), 'yyyy-MM-dd')
              push(`/~/page?id=${dateStr}`)
            }}
          >
            <ChevronLeft size={16} />
          </div>
          <div
            className="bg-foreground/5 px-2 py-[6px] rounded-full hover:bg-foreground/10 transition-colors cursor-pointer"
            onClick={() => {
              const dateStr = format(addDays(currentDate, 1), 'yyyy-MM-dd')
              push(`/~/page?id=${dateStr}`)
            }}
          >
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
    )
  },
)
