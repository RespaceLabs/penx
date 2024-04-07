import { Box } from '@fower/react'
import { SortAsc } from 'lucide-react'
import { Divider, Popover, PopoverContent, PopoverTrigger } from 'uikit'
import { useDatabaseContext } from '../../DatabaseContext'
import { ToolbarBtn } from '../ToolbarBtn'
import { AddSortBtn } from './AddSortBtn'
import { SortItem } from './SortItem'

export const SortField = () => {
  const { currentView } = useDatabaseContext()

  if (!currentView) return null

  const { sorts = [] } = currentView.props

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <ToolbarBtn
          isHighlight={!!sorts.length}
          hightLightColor="red"
          icon={<SortAsc size={16} />}
        >
          <Box toCenterY gap1>
            {!!sorts.length && <Box> {sorts.length} sorted fields</Box>}
            {!sorts.length && <Box>Sort</Box>}
          </Box>
        </ToolbarBtn>
      </PopoverTrigger>
      <PopoverContent w-300>
        {!sorts.length && (
          <Box p3 gray400 textSM>
            No sorts applied to this view
          </Box>
        )}

        {!!sorts.length && (
          <Box p3 column gap1>
            {sorts.map((sort) => (
              <SortItem key={sort.columnId} sort={sort} />
            ))}
          </Box>
        )}

        <Divider />
        <Box p3 toBetween toCenterY>
          <Box gray400 textSM>
            Coming soon
          </Box>
          <AddSortBtn />
        </Box>
      </PopoverContent>
    </Popover>
  )
}
