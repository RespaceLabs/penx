import { Box, FowerHTMLProps } from '@fower/react'
import { CalendarCheck, ListChecks, Target } from 'lucide-react'

interface FilterItemProps extends FowerHTMLProps<'div'> {}

export const FilterItem = ({ ...rest }: FilterItemProps) => {
  return (
    <Box
      bgNeutral100
      cursorPointer
      textSM
      toCenterY
      h-36
      px3
      roundedFull
      gap1
      {...rest}
    ></Box>
  )
}

export const TodoFilter = () => {
  return (
    <Box>
      <Box toCenterY gap2>
        <FilterItem brand500>
          <Target size={18} />
          <Box>Today</Box>
        </FilterItem>
        <FilterItem>
          <CalendarCheck size={18}></CalendarCheck>
          <Box>7 todays</Box>
        </FilterItem>
        <FilterItem>
          <ListChecks size={18} />
          <Box>All Todos</Box>
        </FilterItem>
      </Box>
    </Box>
  )
}
