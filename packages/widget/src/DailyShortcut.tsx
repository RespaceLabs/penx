import { forwardRef } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'
import { addDays, subDays } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { store } from '@penx/store'

interface Props extends FowerHTMLProps<'div'> {
  date: string
}

export const DailyShortcut = forwardRef<HTMLDivElement, Props>(
  function DailyShortcut({ date, ...rest }, ref) {
    const currentDate = new Date(date ?? Date.now())

    return (
      <Box ref={ref} textXS fontNormal toCenterY {...rest}>
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
              store.node.selectDailyNote(subDays(currentDate, 1))
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
              console.log(
                '======addDays(currentDate, 1):',
                addDays(currentDate, 1),
              )

              store.node.selectDailyNote(addDays(currentDate, 1))
            }}
          >
            <ChevronRight size={16} />
          </Box>
        </Box>
      </Box>
    )
  },
)
