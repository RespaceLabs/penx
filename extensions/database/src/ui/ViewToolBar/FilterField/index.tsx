import { Box } from '@fower/react'
import { Filter } from 'lucide-react'
import { Divider, Popover, PopoverContent, PopoverTrigger } from 'uikit'
import { useDatabaseContext } from '../../DatabaseContext'
import { ToolbarBtn } from '../ToolbarBtn'
import { AddFilterBtn } from './AddFilterBtn'
import { FilterItem } from './FilterItem'

export const FilterField = () => {
  const { columns, currentView } = useDatabaseContext()

  if (!currentView) return null

  const { filters = [] } = currentView.props

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <ToolbarBtn
          isHighlight={!!filters.length}
          hightLightColor="orange"
          icon={<Filter size={16}></Filter>}
        >
          {filters.length > 0 && filters.length} Filter
        </ToolbarBtn>
      </PopoverTrigger>
      <PopoverContent>
        {!filters.length && (
          <Box p3 gray400 textSM>
            No filters applied to this view
          </Box>
        )}

        <Box bgWhite w-480>
          {!!filters.length && (
            <Box p3 column gap1>
              {filters.map((filter, index) => (
                <FilterItem
                  key={filter.columnId}
                  index={index}
                  filter={filter}
                />
              ))}
            </Box>
          )}
          <Divider />
          <Box p3 toBetween toCenterY>
            <Box gray400 textSM>
              Coming soon
            </Box>
            <AddFilterBtn></AddFilterBtn>
          </Box>
        </Box>
      </PopoverContent>
    </Popover>
  )
}
