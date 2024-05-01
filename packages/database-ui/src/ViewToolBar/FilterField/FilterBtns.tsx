import { Box } from '@fower/react'
import { Plus } from 'lucide-react'
import { Button, usePopoverContext } from 'uikit'
import { useDatabaseContext } from '@penx/database-context'
import { Filter, IViewNode, ViewColumn } from '@penx/model-types'

interface IFilterBtns {
  filters: Filter[]
  viewColumns: ViewColumn[]
  currentView: IViewNode
  addFilter: () => void
}

export const FilterBtns = ({
  addFilter,
  currentView,
  filters,
}: IFilterBtns) => {
  const { applyFilter } = useDatabaseContext()
  const { close } = usePopoverContext()

  async function onApplyFilter() {
    await applyFilter(currentView.id, filters)
    close()
  }

  return (
    <>
      <Button
        size="sm"
        variant="light"
        colorScheme="gray500"
        onClick={addFilter}
      >
        <Plus size={16} />
        <Box>Add filter</Box>
      </Button>
      <Box gray400 textSM>
        <Button
          size="sm"
          variant="light"
          colorScheme="gray500"
          onClick={onApplyFilter}
        >
          Apply filter
        </Button>
      </Box>
    </>
  )
}
