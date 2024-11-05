import { forwardRef } from 'react'
import { store } from '@/store'
import { addDays, subDays } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  date?: string
}

export const DailyShortcut = forwardRef<HTMLDivElement, Props>(
  function DailyShortcut({ date, ...rest }, ref) {
    const currentDate = new Date(date ?? Date.now())

    return (
      <div
        ref={ref}
        className="text-xs font-normal flex items-center"
        {...rest}
      >
        <div
          className="cursor-pointer bg-foreground/5 px-2 py-[6px] rounded-full hover:bg-foreground/15 transition-colors"
          onClick={() => {
            store.node.selectDailyNote(new Date())
          }}
        >
          Today
        </div>
        <div className="flex items-center gap-2 ml-2">
          <div
            className="bg-foreground/5 w-5 h-5 rounded-full flex items-center justify-center hover:bg-foreground/15 transition-colors cursor-pointer"
            onClick={() => {
              store.node.selectDailyNote(subDays(currentDate, 1))
            }}
          >
            <ChevronLeft size={16} />
          </div>
          <div
            className="bg-foreground/10 w-5 h-5 rounded-full hover:bg-foreground/20 transition-all cursor-pointer flex items-center justify-center"
            onClick={() => {
              store.node.selectDailyNote(addDays(currentDate, 1))
            }}
          >
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
    )
  },
)
