import { ChangeEvent, useContext, useEffect } from 'react'
import { Box } from '@fower/react'
import { Filter } from 'lucide-react'
import {
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
  usePopoverContext,
} from 'uikit'
import { TableSearch, ToolbarBtn } from '@penx/database-ui'
import { SpacesContext } from '..'
import { FilterBtns } from './FilterBtns'
import { FilterItem } from './FilterItem'
import { useFilterField } from './useFilterField'

export function DashboardFilter() {
  const { filtersDb } = useContext(SpacesContext)

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
    viewColumns,
    filtersDb,
    setFiltersDb,
    spaceNodes,
    activeSpace,
    setSpaceNodes,
  } = useContext(SpacesContext)

  const { filters, setFilters, addFilter, updateFilter, deleteFilter } =
    useFilterField()

  const onChangeValue = (
    val: ChangeEvent<HTMLInputElement>,
    columnId: string,
  ) => {
    updateFilter(columnId, columnId, { value: val.target.value })
  }

  const { isOpen } = usePopoverContext()

  useEffect(() => {
    if (isOpen) {
      setFilters([...filtersDb])
      TableSearch.initTableSearch(spaceNodes, activeSpace.id, false)
    }
  }, [isOpen])

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
            {filters.map((filter) => (
              <FilterItem
                key={filter.columnId}
                filter={filter}
                sortedColumns={viewColumns}
                deleteFilter={deleteFilter}
                updateFilter={updateFilter}
                onChangeValue={onChangeValue}
              />
            ))}
          </Box>
        )}
        <Divider />
        <Box p3 toBetween toCenterY>
          <FilterBtns
            filters={filters}
            activeSpace={activeSpace}
            spaceNodes={spaceNodes}
            addFilter={addFilter}
            setFiltersDb={setFiltersDb}
            setSpaceNodes={setSpaceNodes}
          />
        </Box>
      </Box>
    </>
  )
}
