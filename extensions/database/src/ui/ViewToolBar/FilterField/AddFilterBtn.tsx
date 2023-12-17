import { Box } from '@fower/react'
import { Plus } from 'lucide-react'
import { Button } from 'uikit'
import { OperatorType } from '@penx/model-types'
import { useDatabaseContext } from '../../DatabaseContext'

export const AddFilterBtn = () => {
  const { currentView, addFilter } = useDatabaseContext()
  const { filters = [], viewColumns: columns = [] } = currentView.props

  async function createFilter() {
    const viewColumn = columns.find(
      (c) => !filters.map((i) => i.columnId).includes(c.columnId),
    )!

    const column = columns.find((c) => c.columnId === viewColumn.columnId)

    // console.log('column', column)
    if (column) {
      addFilter(currentView.id, column.columnId, {
        operator: OperatorType.EQUAL,
        value: '',
      })
    }
  }

  return (
    <Button
      size="sm"
      variant="light"
      colorScheme="gray500"
      onClick={createFilter}
    >
      <Plus size={16} />
      <Box>Add filter</Box>
    </Button>
  )
}
