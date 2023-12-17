import { Box } from '@fower/react'
import { Plus } from 'lucide-react'
import { Button } from 'uikit'
import { OperatorType } from '@penx/model-types'
import { useDatabaseContext } from '../../DatabaseContext'

export const AddFilterBtn = () => {
  const { currentView, addFilter } = useDatabaseContext()
  const { filters = [], columns = [] } = currentView.props

  async function createFilter() {
    const viewColumn = columns.find(
      (c) => !filters.map((i) => i.columnId).includes(c.id),
    )!

    const column = columns.find((c) => c.id === viewColumn.id)

    // console.log('column', column)
    if (column) {
      addFilter(currentView.id, column.id, {
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
