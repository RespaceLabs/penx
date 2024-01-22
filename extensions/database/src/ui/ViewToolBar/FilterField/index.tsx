import { ChangeEvent, useEffect, useMemo } from 'react'
import { Box } from '@fower/react'
import { Filter } from 'lucide-react'
import {
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
  usePopoverContext,
} from 'uikit'
import { ToolbarBtn } from '../ToolbarBtn'
import { FilterBtns } from './FilterBtns'
import { FilterItem } from './FilterItem'
import { useFilterField } from './useFilterField'

export const FilterField = () => {
  const { filtersDb, currentView } = useFilterField()

  if (!currentView) return null

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <ToolbarBtn
          isHighlight={!!filtersDb.length}
          hightLightColor="orange"
          icon={<Filter size={16}></Filter>}
        >
          {filtersDb.length > 0 && filtersDb.length} Filter
        </ToolbarBtn>
      </PopoverTrigger>
      <PopoverContent>
        <PopContent />
      </PopoverContent>
    </Popover>
  )
}

function PopContent() {
  const {
    filters,
    filtersDb,
    viewColumns,
    columns,
    currentView,
    deleteFilter,
    setFilters,
    addFilter,
    updateFilter,
  } = useFilterField()
  const { isOpen } = usePopoverContext()

  useEffect(() => {
    setFilters([...filtersDb])
  }, [isOpen])

  const sortedColumns = useMemo(() => {
    return currentView.props.viewColumns
      .map((o) => columns.find((c) => c.id === o.columnId)!)
      .filter((i) => {
        const find = filters.find((item) => item.columnId === i.id)
        return !find
      })
  }, [filters])

  const onChangeValue = (
    val: ChangeEvent<HTMLInputElement>,
    columnId: string,
  ) => {
    updateFilter(columnId, columnId, { value: val.target.value })
  }

  return (
    <>
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
                filter={filter}
                deleteFilter={deleteFilter}
                updateFilter={updateFilter}
                columns={columns}
                sortedColumns={sortedColumns}
                onChangeValue={onChangeValue}
              />
            ))}
          </Box>
        )}
        <Divider />
        <Box p3 toBetween toCenterY>
          <FilterBtns
            viewColumns={viewColumns}
            filters={filters}
            addFilter={addFilter}
            currentView={currentView}
          />
        </Box>
      </Box>
    </>
  )
}
