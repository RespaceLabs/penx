import { Box } from '@fower/react'
import { Plus } from 'lucide-react'
import { Button } from 'uikit'
import { OperatorType } from '@penx/model-types'
import { useDatabaseContext } from '../../DatabaseContext'

export const FilterBtns = () => {
  const { currentView, addFilter } = useDatabaseContext()
  const { filters = [], viewColumns: columns = [] } = currentView.props

  async function createFilter() {
    const viewColumn = columns.find(
      (c) => !filters.map((i) => i.columnId).includes(c.columnId),
    )!

    const column = columns.find((c) => c.columnId === viewColumn.columnId)
    if (column) {
      addFilter(currentView.id, column.columnId, {
        operator: OperatorType.EQUAL,
        value: '',
      })
    }
  }

  async function onApplyFilter() {
    console.log('%c=onApplyFilter==DarkGreen', 'color:red')
  }

  return (
    <>
      <Button
        size="sm"
        variant="light"
        colorScheme="gray500"
        onClick={createFilter}
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
