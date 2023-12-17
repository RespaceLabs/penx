import { Box } from '@fower/react'
import { Plus } from 'lucide-react'
import {
  Button,
  Menu,
  MenuItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'uikit'
import { IColumnNode } from '@penx/model-types'
import { useDatabaseContext } from '../../DatabaseContext'
import { FieldIcon } from '../../shared/FieldIcon'

export const AddSortBtn = () => {
  const { currentView, columns, addSort } = useDatabaseContext()

  let { viewColumns = [] } = currentView.props

  // TODO: fallback to old data
  if (!viewColumns.length) {
    viewColumns = (currentView.props as any)?.columns.map((i: any) => ({
      columnId: i.id,
      ...i,
    }))
  }

  const sortedColumns = viewColumns.map(
    (o) => columns.find((c) => c.id === o.columnId)!,
  )

  async function selectColumn(column: IColumnNode) {
    await addSort(currentView.id, column.id, {
      isAscending: true,
    })
  }

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Button size="sm" variant="light" colorScheme="gray500">
          <Plus size={16} />
          <Box>Add sort</Box>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        {({ close }) => (
          <Menu bgWhite w-180 p2 rounded-4>
            {sortedColumns
              .filter((i) => {
                const { sorts = [] } = currentView.props
                const find = sorts.find((item) => item.columnId === i.id)
                return !find
              })
              .map((column) => {
                return (
                  <MenuItem
                    key={column.id}
                    rounded
                    gap2
                    onClick={() => {
                      close()
                      selectColumn(column)
                    }}
                  >
                    <FieldIcon size={18} fieldType={column.props.fieldType} />
                    <Box>{column.props.name}</Box>
                  </MenuItem>
                )
              })}
          </Menu>
        )}
      </PopoverContent>
    </Popover>
  )
}
